import { 
  Message, 
  SessionState, 
  EmotionCode, 
  SessionMetrics,
  IMemoryStore
} from '@garden-calm/types';

/**
 * Временная реализация IMemoryStore для использования внутри core
 * В дальнейшем будет заменена на фабрику из @garden-calm/storage
 */
export class InMemoryMemoryStore implements IMemoryStore {
  private sessions: Map<string, SessionState> = new Map();
  
  // Получить сессию пользователя
  getSession(userId: string): SessionState | null {
    return this.sessions.get(userId) || null;
  }
  
  // Создать новую сессию
  createSession(userId: string): SessionState {
    const session: SessionState = {
      userId,
      messages: [],
      currentEmotion: 'NT',
      emotionScores: {} as Record<EmotionCode, any>,
      lastSuggestion: 0,
      lastR1Call: 0,
      sessionStart: Date.now(),
      metrics: {
        msgLen: 0,
        rollingTokens: 0,
        shortStreak: 0,
        sinceR1_msgs: 0,
        sinceR1_min: 0,
        emBlendScore: 100,
        highUncertainty: false
      }
    };
    this.sessions.set(userId, session);
    return session;
  }
  
  // Получить или создать сессию
  getOrCreateSession(userId: string): SessionState {
    return this.getSession(userId) || this.createSession(userId);
  }
  
  // Добавить сообщение в историю
  addMessage(userId: string, message: Message): void {
    const session = this.getOrCreateSession(userId);
    session.messages.push(message);
    // Ограничиваем историю сообщений
    if (session.messages.length > 100) {
      session.messages = session.messages.slice(-100);
    }
    this.sessions.set(userId, session);
  }
  
  // Получить последние сообщения
  getRecentMessages(userId: string, count: number = 10): Message[] {
    const session = this.getSession(userId);
    if (!session) {
      return [];
    }
    return session.messages.slice(-count);
  }
  
  // Обновить текущую эмоцию
  updateCurrentEmotion(userId: string, emotion: EmotionCode): void {
    const session = this.getOrCreateSession(userId);
    session.currentEmotion = emotion;
    this.sessions.set(userId, session);
  }
  
  // Обновить время последнего предложения медитации
  updateLastSuggestion(userId: string): void {
    const session = this.getOrCreateSession(userId);
    session.lastSuggestion = Date.now();
    this.sessions.set(userId, session);
  }
  
  // Обновить время последнего вызова R1
  updateLastR1Call(userId: string): void {
    const session = this.getOrCreateSession(userId);
    session.lastR1Call = Date.now();
    this.sessions.set(userId, session);
  }
  
  // Обновить метрики сессии
  updateMetrics(userId: string, metrics: SessionMetrics): void {
    const session = this.getOrCreateSession(userId);
    session.metrics = metrics;
    this.sessions.set(userId, session);
  }
  
  // Очистить старые сессии
  cleanup(): void {
    const now = Date.now();
    const ttl = 7200000; // 2 часа по умолчанию
    for (const [userId, session] of this.sessions.entries()) {
      // Проверяем время последней активности
      const lastActivity = Math.max(
        session.lastSuggestion,
        session.lastR1Call,
        session.messages.length > 0 
          ? session.messages[session.messages.length - 1].timestamp 
          : 0
      );
      if (now - lastActivity > ttl) {
        this.sessions.delete(userId);
      }
    }
  }
  
  // Получить статистику хранилища
  getStats(): {
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    oldestSession: number;
    newestSession: number;
  } {
    let totalMessages = 0;
    let oldestSession = Date.now();
    let newestSession = 0;
    for (const session of this.sessions.values()) {
      totalMessages += session.messages.length;
      
      if (session.sessionStart < oldestSession) {
        oldestSession = session.sessionStart;
      }
      
      if (session.sessionStart > newestSession) {
        newestSession = session.sessionStart;
      }
    }
    return {
      totalSessions: this.sessions.size,
      totalMessages,
      averageMessagesPerSession: this.sessions.size > 0 
        ? totalMessages / this.sessions.size 
        : 0,
      oldestSession,
      newestSession
    };
  }
}
