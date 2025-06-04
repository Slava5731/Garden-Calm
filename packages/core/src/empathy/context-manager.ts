import { 
  DeltaSnapshot, 
  RollingBrief, 
  LongSummary,
  Message,
  EmotionCode,
  HaikuContext,
  R1Context,
  SessionMetrics
} from '../types';
import { EMOTION_MATRIX } from '../emotion-matrix/matrix';

interface SessionMemory {
  userId: string;
  snapshots: DeltaSnapshot[];
  currentBrief?: RollingBrief;
  longSummaries: LongSummary[];
  emotionalTimeline: {
    timestamp: number;
    code: EmotionCode;
    confidence: number;
    messageId: string;
  }[];
  lastUpdated: number;
}

export class ContextManager {
  private sessions: Map<string, SessionMemory> = new Map();
  
  constructor() {}

  // Добавить новый снапшот
  async addSnapshot(
    userId: string,
    snapshot: string,
    emotionCode: EmotionCode,
    messageId: string,
    confidence: number
  ): Promise<void> {
    const session = this.getOrCreateSession(userId);
    
    // 1. Добавляем новый снапшот
    const newSnapshot: DeltaSnapshot = {
      timestamp: Date.now(),
      content: snapshot,
      emotionCode,
      messageId
    };
    
    session.snapshots.push(newSnapshot);
    
    // 2. Обновляем эмоциональную временную линию
    session.emotionalTimeline.push({
      timestamp: Date.now(),
      code: emotionCode,
      confidence,
      messageId
    });
    
    // 3. Проверяем, нужно ли обновить Rolling Brief
    const emotionChanged = this.hasEmotionChanged(session);
    if (this.shouldUpdateBrief(session, emotionChanged)) {
      await this.updateRollingBrief(session);
    }
    
    // 4. Проверяем, нужно ли создать Long Summary
    if (this.shouldCreateSummary(session)) {
      await this.createLongSummary(session);
    }
    
    // 5. Обновляем время последнего обновления
    session.lastUpdated = Date.now();
    
    // 6. Сохраняем сессию
    this.sessions.set(userId, session);
  }

  // Получить контекст для Haiku
  getHaikuContext(
    userId: string,
    currentHint?: string,
    currentInsight?: string
  ): HaikuContext {
    const session = this.sessions.get(userId);
    
    if (!session) {
      return {
        recentMessages: [],
        briefSnapshot: '',
        emotionalState: 'NT',
        currentHint,
        currentInsight
      };
    }
    
    // Получаем последнюю эмоцию
    const lastEmotion = session.emotionalTimeline.length > 0
      ? session.emotionalTimeline[session.emotionalTimeline.length - 1].code
      : 'NT';
    
    // Получаем текущий Rolling Brief или создаем пустой
    const briefSnapshot = session.currentBrief
      ? session.currentBrief.content
      : 'Начало разговора';
    
    return {
      recentMessages: [], // Будет заполнено в EmpathyOrchestrator
      briefSnapshot,
      emotionalState: lastEmotion,
      currentHint,
      currentInsight
    };
  }

  // Получить контекст для R1
  getR1Context(
    userId: string,
    messages: Message[],
    metrics: SessionMetrics
  ): R1Context {
    const session = this.sessions.get(userId);
    
    if (!session) {
      return {
        fullHistory: messages,
        emotionalTimeline: [],
        detailedSnapshot: '',
        sessionMetrics: metrics
      };
    }
    
    // Собираем все снапшоты в один детальный
    const detailedSnapshot = this.buildDetailedSnapshot(session);
    
    return {
      fullHistory: messages,
      emotionalTimeline: session.emotionalTimeline.map(e => ({
        timestamp: e.timestamp,
        code: e.code,
        confidence: e.confidence,
        message: messages.find(m => m.id === e.messageId)?.content || ''
      })),
      detailedSnapshot,
      sessionMetrics: metrics
    };
  }

  // Запросить Long Summary (например, перед медитацией)
  async requestLongSummary(userId: string): Promise<string> {
    const session = this.sessions.get(userId);
    
    if (!session) {
      return 'Недостаточно данных для создания сводки.';
    }
    
    // Если есть недавний Long Summary, возвращаем его
    const recentSummary = session.longSummaries[session.longSummaries.length - 1];
    if (recentSummary && Date.now() - recentSummary.timestamp < 300000) { // 5 минут
      return recentSummary.content;
    }
    
    // Иначе создаем новый
    const summary = await this.createLongSummary(session);
    return summary.content;
  }

  // Очистить старые сессии
  cleanupOldSessions(maxAge: number = 7200000): void { // 2 часа по умолчанию
    const now = Date.now();
    
    for (const [userId, session] of this.sessions.entries()) {
      if (now - session.lastUpdated > maxAge) {
        this.sessions.delete(userId);
      }
    }
  }

  // Экспорт сессии для отладки
  exportSession(userId: string): SessionMemory | null {
    return this.sessions.get(userId) || null;
  }

  // === Приватные методы ===

  private getOrCreateSession(userId: string): SessionMemory {
    let session = this.sessions.get(userId);
    
    if (!session) {
      session = {
        userId,
        snapshots: [],
        longSummaries: [],
        emotionalTimeline: [],
        lastUpdated: Date.now()
      };
      this.sessions.set(userId, session);
    }
    
    return session;
  }

  private hasEmotionChanged(session: SessionMemory): boolean {
    const timeline = session.emotionalTimeline;
    
    if (timeline.length < 2) {
      return false;
    }
    
    const lastEmotion = timeline[timeline.length - 1].code;
    const prevEmotion = timeline[timeline.length - 2].code;
    
    return lastEmotion !== prevEmotion;
  }

  private shouldUpdateBrief(session: SessionMemory, emotionChanged: boolean): boolean {
    const now = Date.now();
    const timeSinceLastBrief = session.currentBrief 
      ? now - session.currentBrief.timestamp 
      : Infinity;
    
    // Обновляем Brief если:
    // 1. Это первый Brief
    // 2. Прошло больше 10 минут с последнего обновления
    // 3. Эмоция изменилась и прошло больше 2 минут
    // 4. Накопилось 5 или больше снапшотов с последнего обновления
    
    if (!session.currentBrief) {
      return true;
    }
    
    if (timeSinceLastBrief > 600000) { // 10 минут
      return true;
    }
    
    if (emotionChanged && timeSinceLastBrief > 120000) { // 2 минуты
      return true;
    }
    
    const snapshotsAfterBrief = session.snapshots.filter(
      s => s.timestamp > (session.currentBrief?.timestamp || 0)
    );
    
    if (snapshotsAfterBrief.length >= 5) {
      return true;
    }
    
    return false;
  }

  private shouldCreateSummary(session: SessionMemory): boolean {
    // Создаем Long Summary если:
    // 1. Это первый Summary и есть хотя бы 10 снапшотов
    // 2. Прошло больше 30 минут с последнего Summary
    // 3. Было 3 или больше обновлений Brief с последнего Summary
    
    if (session.snapshots.length < 10) {
      return false;
    }
    
    if (session.longSummaries.length === 0) {
      return true;
    }
    
    const lastSummary = session.longSummaries[session.longSummaries.length - 1];
    const now = Date.now();
    
    if (now - lastSummary.timestamp > 1800000) { // 30 минут
      return true;
    }
    
    // Считаем количество Brief после последнего Summary
    const briefsAfterSummary = session.currentBrief && 
      session.currentBrief.timestamp > lastSummary.timestamp ? 1 : 0;
    
    return briefsAfterSummary >= 3;
  }

  private async updateRollingBrief(session: SessionMemory): Promise<RollingBrief> {
    // В реальной системе здесь был бы вызов LLM для генерации Brief
    // Для упрощения мы просто объединяем последние снапшоты
    
    const recentSnapshots = session.snapshots.slice(-5);
    const dominantEmotion = this.findDominantEmotion(session);
    
    const briefContent = recentSnapshots
      .map(s => s.content)
      .join(' | ')
      .substring(0, 200) + '...';
    
    const brief: RollingBrief = {
      content: briefContent,
      timestamp: Date.now(),
      messageCount: recentSnapshots.length,
      dominantEmotion
    };
    
    session.currentBrief = brief;
    return brief;
  }

  private async createLongSummary(session: SessionMemory): Promise<LongSummary> {
    // В реальной системе здесь был бы вызов LLM для генерации Summary
    // Для упрощения мы просто объединяем все снапшоты
    
    const emotionalJourney = session.emotionalTimeline
      .slice(-10)
      .map(e => e.code);
    
    const sessionStart = session.emotionalTimeline[0]?.timestamp || Date.now();
    const sessionDuration = Date.now() - sessionStart;
    
    const summaryContent = `Сводка разговора (${new Date().toLocaleTimeString()}): ` +
      `${session.snapshots.slice(-10).map(s => s.content).join(' | ').substring(0, 300)}...`;
    
    const summary: LongSummary = {
      content: summaryContent,
      timestamp: Date.now(),
      sessionDuration,
      emotionalJourney,
      keyInsights: ['Автоматически сгенерированная сводка']
    };
    
    session.longSummaries.push(summary);
    return summary;
  }

  private findDominantEmotion(session: SessionMemory): EmotionCode {
    const emotions = session.emotionalTimeline.slice(-5).map(e => e.code);
    
    if (emotions.length === 0) {
      return 'NT';
    }
    
    // Подсчитываем частоту каждой эмоции
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let dominant: EmotionCode = 'NT';
    
    for (const emotion of emotions) {
      counts[emotion] = (counts[emotion] || 0) + 1;
      
      if (counts[emotion] > maxCount) {
        maxCount = counts[emotion];
        dominant = emotion;
      }
    }
    
    return dominant;
  }

  private buildDetailedSnapshot(session: SessionMemory): string {
    // Объединяем все снапшоты с информацией об эмоциях
    let result = 'Детальный анализ сессии:\n\n';
    
    // Добавляем информацию о доминирующих эмоциях
    const emotionCounts: Partial<Record<EmotionCode, number>> = {};
    
    for (const e of session.emotionalTimeline) {
      emotionCounts[e.code] = (emotionCounts[e.code] || 0) + 1;
    }
    
    const sortedEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    result += 'Доминирующие эмоции:\n';
    for (const [code, count] of sortedEmotions) {
      const emotionName = EMOTION_MATRIX[code as EmotionCode].emotion;
      result += `- ${emotionName} (${code}): ${count} раз\n`;
    }
    
    result += '\nКлючевые моменты:\n';
    
    // Добавляем последние снапшоты
    const significantSnapshots = session.snapshots
      .filter((s, i, arr) => {
        // Берем первый, последний и снапшоты при смене эмоции
        if (i === 0 || i === arr.length - 1) return true;
        
        const prevEmotion = arr[i - 1].emotionCode;
        return s.emotionCode !== prevEmotion;
      })
      .slice(-5);
    
    for (const snapshot of significantSnapshots) {
      const emotionName = EMOTION_MATRIX[snapshot.emotionCode].emotion;
      const time = new Date(snapshot.timestamp).toLocaleTimeString();
      
      result += `[${time}, ${emotionName}] ${snapshot.content}\n`;
    }
    
    // Добавляем последний Rolling Brief, если есть
    if (session.currentBrief) {
      result += '\nТекущее резюме:\n';
      result += session.currentBrief.content;
    }
    
    return result;
  }
}
