import { 
  V3Response, 
  Message, 
  EmotionCode, 
  SuggestionResult,
  HaikuContext,
  R1Context,
  IMemoryStore
} from '@garden-calm/types';
import { InMemoryMemoryStore } from '../interfaces/in-memory-store';
import { V3Adapter } from '../ai/v3-adapter';
import { ScoringEngine } from './scoring-engine';
import { ContextManager } from './context-manager';
import { SuggestionEngine } from './suggestion-engine';
import { DecisionEngine } from '../ai/decision-engine';

export interface OrchestratorConfig {
  v3ApiKey: string;
  v3Endpoint?: string;
  memoryStore?: IMemoryStore;
  scoringEngine?: ScoringEngine;
  contextManager?: ContextManager;
  suggestionEngine?: SuggestionEngine;
  decisionEngine?: DecisionEngine;
}

export interface AnalysisResult {
  v3Response: V3Response;
  shouldSuggestMeditation: boolean;
  suggestedEmotion?: EmotionCode;
  shouldCallR1: boolean;
  r1Reason?: string;
  haikuContext: HaikuContext;
  timestamp: number;
}

export class EmpathyOrchestrator {
  private v3Adapter: V3Adapter;
  private memoryStore: IMemoryStore;
  private scoringEngine: ScoringEngine;
  private contextManager: ContextManager;
  private suggestionEngine: SuggestionEngine;
  private decisionEngine: DecisionEngine;
  
  // Временная реализация фабрики для создания хранилища
  private createDefaultMemoryStore(): IMemoryStore {
    return new InMemoryMemoryStore(); // временно, пока не подключим фабрику
  }

  constructor(config: OrchestratorConfig) {
    // Инициализация компонентов
    this.v3Adapter = new V3Adapter({
      apiKey: config.v3ApiKey,
      endpoint: config.v3Endpoint
    });

    // Используем переданное хранилище или создаем новое через фабрику
    this.memoryStore = config.memoryStore || this.createDefaultMemoryStore();
    this.scoringEngine = config.scoringEngine || new ScoringEngine();
    this.contextManager = config.contextManager || new ContextManager();
    this.suggestionEngine = config.suggestionEngine || 
      new SuggestionEngine(this.scoringEngine);
    this.decisionEngine = config.decisionEngine || new DecisionEngine();
  }

  // Основной метод анализа сообщения
  async analyzeMessage(
    userId: string,
    message: string,
    messageId: string
  ): Promise<AnalysisResult> {
    const timestamp = Date.now();

    // 1. Сохраняем сообщение пользователя
    const userMessage: Message = {
      id: messageId,
      userId,
      content: message,
      timestamp,
      role: 'user'
    };
    this.memoryStore.addMessage(userId, userMessage);

    // 2. Получаем контекст для V3
    const recentMessages = this.memoryStore.getRecentMessages(userId, 3);

    // 3. Анализ через V3
    const v3Response = await this.v3Adapter.analyze(message, recentMessages);

    // 4. Обновляем эмоциональное состояние
    this.memoryStore.updateCurrentEmotion(userId, v3Response.code);
    userMessage.emotionCode = v3Response.code;

    // 5. Обновляем Empathy Meter
    const emotionScore = this.scoringEngine.update(userId, v3Response);

    // 6. Обновляем контекст
    await this.contextManager.addSnapshot(
      userId,
      v3Response.snapshot,
      v3Response.code,
      messageId,
      v3Response.confidence
    );

    // 7. Проверяем необходимость предложить медитацию
    const suggestionResult = this.suggestionEngine.shouldSuggestMeditation(
      userId,
      v3Response
    );

    // 8. Вычисляем метрики для Decision Engine
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    const secondEmotion = this.scoringEngine.getSecondEmotion(userId);
    const emBlendScore = topEmotion && secondEmotion
      ? topEmotion.score.value - secondEmotion.score.value
      : 100;

    const metrics = this.decisionEngine.calculateMetrics(
      userId,
      message,
      emBlendScore,
      v3Response.confidence
    );
    this.memoryStore.updateMetrics(userId, metrics);

    // 9. Проверяем необходимость вызова R1
    const r1Decision = this.decisionEngine.shouldCallR1(
      userId,
      metrics,
      v3Response,
      userMessage
    );

    // 10. Получаем контекст для Haiku
    const haikuContext = this.contextManager.getHaikuContext(
      userId,
      v3Response.hint,
      v3Response.insight
    );
    // Добавляем последние сообщения
    haikuContext.recentMessages = recentMessages;

    // 11. Формируем результат
    const result: AnalysisResult = {
      v3Response,
      shouldSuggestMeditation: suggestionResult.shouldSuggest,
      suggestedEmotion: suggestionResult.emotionCode,
      shouldCallR1: r1Decision.shouldCall,
      r1Reason: r1Decision.reason,
      haikuContext,
      timestamp
    };

    // 12. Если нужно предложить медитацию - обновляем состояние
    if (suggestionResult.shouldSuggest) {
      this.memoryStore.updateLastSuggestion(userId);
    }

    // 13. Если нужен R1 - помечаем
    if (r1Decision.shouldCall) {
      // R1 будет вызван асинхронно
      setTimeout(() => {
        this.handleR1Call(userId);
      }, r1Decision.delayMs || 0);
    }

    return result;
  }

  // Обработка принятия предложения медитации
  async onMeditationAccepted(userId: string): Promise<void> {
    this.suggestionEngine.onSuggestionAccepted(userId);
    
    // Запрашиваем Long Summary перед медитацией
    const summary = await this.contextManager.requestLongSummary(userId);
    
    // Можно использовать summary для персонализации медитации
    console.log('Meditation accepted, summary generated:', summary);
  }

  // Обработка отклонения предложения медитации
  onMeditationDeclined(userId: string): void {
    this.suggestionEngine.onSuggestionDeclined(userId);
  }

  // Получить контекст для R1
  async getR1Context(userId: string): Promise<R1Context> {
    const session = this.memoryStore.getSession(userId);
    if (!session) {
      throw new Error('Session not found');
    }

    const r1Context = this.contextManager.getR1Context(
      userId,
      session.messages,
      session.metrics
    );

    return r1Context;
  }

  // Получить анализ готовности к медитации
  getMeditationReadiness(userId: string): ReturnType<SuggestionEngine['analyzeMeditationReadiness']> {
    return this.suggestionEngine.analyzeMeditationReadiness(userId);
  }

  // Получить рекомендуемые эмоции
  getRecommendedEmotions(userId: string, limit?: number): EmotionCode[] {
    return this.suggestionEngine.getRecommendedEmotions(userId, limit);
  }

  // Сохранить ответ ассистента
  saveAssistantMessage(userId: string, message: Message): void {
    this.memoryStore.addMessage(userId, message);
  }

  // Очистка старых данных
  cleanup(): void {
    this.memoryStore.cleanup();
    this.scoringEngine.cleanupOldSessions();
    this.contextManager.cleanupOldSessions();
    this.decisionEngine.cleanup();
  }

  // Экспорт состояния для отладки
  exportState(userId: string): {
    session: any;
    empathyState: any;
    contextSession: any;
    decisionStats: any;
  } {
    return {
      session: this.memoryStore.getSession(userId),
      empathyState: this.scoringEngine.exportState(userId),
      contextSession: this.contextManager.exportSession(userId),
      decisionStats: this.decisionEngine.getStats(userId)
    };
  }

  // === Приватные методы ===

  private async handleR1Call(userId: string): Promise<void> {
    try {
      console.log(`Triggering R1 analysis for user ${userId}`);
      
      // Помечаем вызов R1
      this.memoryStore.updateLastR1Call(userId);
      this.decisionEngine.markR1Called(userId);

      // Получаем контекст для R1
      const r1Context = await this.getR1Context(userId);

      // Здесь будет вызов R1 API
      // const r1Result = await this.r1Adapter.analyze(r1Context);
      
      console.log('R1 context prepared:', {
        messagesCount: r1Context.fullHistory.length,
        emotionalPoints: r1Context.emotionalTimeline.length,
        snapshot: r1Context.detailedSnapshot.substring(0, 100) + '...'
      });

    } catch (error) {
      console.error('R1 call failed:', error);
    }
  }

  // Статистика системы
  getSystemStats(): {
    memory: ReturnType<IMemoryStore['getStats']>;
    activeSessions: number;
    totalAnalyses: number;
  } {
    const memoryStats = this.memoryStore.getStats();
    
    // Подсчет общего количества анализов
    let totalAnalyses = 0;
    for (let i = 0; i < memoryStats.totalSessions; i++) {
      // Приблизительно: каждое сообщение = один анализ
      totalAnalyses += memoryStats.averageMessagesPerSession;
    }

    return {
      memory: memoryStats,
      activeSessions: memoryStats.totalSessions,
      totalAnalyses: Math.floor(totalAnalyses)
    };
  }
}

// Фабричная функция для создания оркестратора
export function createEmpathyOrchestrator(config: {
  v3ApiKey: string;
  v3Endpoint?: string;
}): EmpathyOrchestrator {
  return new EmpathyOrchestrator(config);
}
