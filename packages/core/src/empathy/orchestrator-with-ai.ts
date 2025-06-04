// packages/core/src/empathy/orchestrator-with-ai.ts
import { EmpathyOrchestrator, OrchestratorConfig, AnalysisResult } from './orchestrator';
import { HaikuAdapter } from '../ai/haiku-adapter';
import { R1Adapter } from '../ai/r1-adapter';
import { Message, HaikuContext } from '@garden-calm/types';

export interface AIConfig {
  haiku?: {
    apiKey: string;
    endpoint?: string;
  };
  r1?: {
    apiKey: string;
    endpoint?: string;
  };
  enableAI?: boolean;
}

export class AIEmpathyOrchestrator extends EmpathyOrchestrator {
  private haikuAdapter?: HaikuAdapter;
  private r1Adapter?: R1Adapter;
  private enableAI: boolean;

  constructor(config: OrchestratorConfig & AIConfig) {
    super(config);
    
    this.enableAI = config.enableAI ?? false;
    
    if (config.haiku && this.enableAI) {
      this.haikuAdapter = new HaikuAdapter(config.haiku);
    }
    
    if (config.r1 && this.enableAI) {
      this.r1Adapter = new R1Adapter(config.r1);
    }
  }

  // Переопределяем основной метод анализа
  async analyzeMessage(
    userId: string,
    message: string,
    messageId: string
  ): Promise<AnalysisResult> {
    // Базовый анализ через родительский класс
    const result = await super.analyzeMessage(userId, message, messageId);
    
    // Если AI включен и доступен Haiku - получаем реальный ответ
    if (this.enableAI && this.haikuAdapter) {
      try {
        const haikuResponse = await this.haikuAdapter.respond(
          message,
          result.haikuContext
        );
        
        // Сохраняем ответ ассистента
        this.saveAssistantMessage(userId, {
          id: `asst_${Date.now()}`,
          userId,
          content: haikuResponse,
          timestamp: Date.now(),
          role: 'assistant'
        });
        
        // Добавляем реальный ответ в результат
        (result as any).assistantResponse = haikuResponse;
      } catch (error) {
        console.error('Haiku response failed:', error);
        // Используем фоллбек из базового класса
      }
    }
    
    // Если нужен R1 и он доступен - планируем вызов
    if (result.shouldCallR1 && this.enableAI && this.r1Adapter) {
      setTimeout(() => this.performR1Analysis(userId), 3000);
    }
    
    return result;
  }

  // Выполнение R1 анализа
  private async performR1Analysis(userId: string): Promise<void> {
    if (!this.r1Adapter) return;
    
    try {
      console.log(`Performing R1 analysis for user ${userId}`);
      
      // Получаем контекст
      const r1Context = await this.getR1Context(userId);
      
      // Выполняем анализ
      const analysis = await this.r1Adapter.analyze(r1Context);
      
      console.log('R1 Analysis complete:', {
        userId,
        deepInsight: analysis.deepInsight,
        suggestedTone: analysis.suggestedTone,
        meditationRecommended: analysis.meditationRecommended
      });
      
      // Обновляем состояние на основе анализа
      if (analysis.meditationRecommended) {
        console.log('R1 recommends meditation for user', userId);
        // Можно отправить уведомление через WebSocket
      }
      
      // Обновляем Long Summary
      const session = this.contextManager.exportSession(userId);
      if (session && this.r1Adapter) {
        const longSummary = await this.r1Adapter.generateLongSummary(
          r1Context.detailedSnapshot,
          session.emotionalTimeline.map(p => p.code),
          analysis.keyThemes
        );
        
        console.log('Generated long summary:', longSummary.substring(0, 100) + '...');
      }
      
    } catch (error) {
      console.error('R1 analysis failed:', error);
    }
  }

  // Простой метод для прямого получения ответа Haiku
  async getHaikuResponse(message: string, userId: string): Promise<string> {
    if (!this.enableAI || !this.haikuAdapter) {
      return this.getDefaultResponse(message, {
        recentMessages: [],
        briefSnapshot: 'No prior context',
        emotionalState: 'NT'
      });
    }
    
    const session = this.memoryStore.getSession(userId);
    const haikuContext = this.contextManager.getHaikuContext(userId);
    haikuContext.recentMessages = session?.messages.slice(-3) || [];
    
    try {
      return await this.haikuAdapter.respond(message, haikuContext);
    } catch (error) {
      console.error('Haiku failed:', error);
      return "I'm here with you. Tell me more about how you're feeling.";
    }
  }

  // Добавляем метод для совместимости с базовым классом
  private getDefaultResponse(message: string, context: HaikuContext): string {
    // Простые фоллбеки на основе hint
    if (context.currentHint?.includes('calm')) {
      return "I hear you. Let's take a moment to breathe together.";
    }
    if (context.currentHint?.includes('warm')) {
      return "I'm glad you're here. How are you feeling right now?";
    }
    if (context.currentHint?.includes('acknowledge')) {
      return "I understand. That sounds really challenging.";
    }
    return "I'm here with you. Tell me what's on your mind.";
  }
}

// Фабричная функция для создания оркестратора с AI
export function createAIOrchestrator(config: {
  v3ApiKey: string;
  v3Endpoint?: string;
  haikuApiKey?: string;
  r1ApiKey?: string;
  enableAI?: boolean;
}): AIEmpathyOrchestrator {
  return new AIEmpathyOrchestrator({
    v3ApiKey: config.v3ApiKey,
    v3Endpoint: config.v3Endpoint,
    haiku: config.haikuApiKey ? {
      apiKey: config.haikuApiKey
    } : undefined,
    r1: config.r1ApiKey ? {
      apiKey: config.r1ApiKey  
    } : undefined,
    enableAI: config.enableAI ?? (!!config.haikuApiKey || !!config.r1ApiKey)
  });
}
