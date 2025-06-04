import { Message, SessionMetrics } from '../types';
import { V3Response } from '../types/ai';
import { EmotionCode } from '../types/emotion';

interface DecisionStats {
  userId: string;
  r1Calls: number;
  lastR1Call: number;
  metrics: SessionMetrics;
}

export class DecisionEngine {
  private stats: Map<string, DecisionStats> = new Map();
  private messageHistory: Map<string, Message[]> = new Map();
  
  constructor() {}

  // Основной метод принятия решения о вызове R1
  shouldCallR1(
    userId: string,
    metrics: SessionMetrics,
    v3Result: V3Response,
    message: Message
  ): {
    shouldCall: boolean;
    reason?: string;
    delayMs?: number;
  } {
    // 1. Обновляем историю сообщений
    this.updateMessageHistory(userId, message);
    
    // 2. Обновляем метрики
    this.updateStats(userId, metrics);
    
    // 3. Проверяем, прошло ли достаточно времени с последнего вызова R1
    const timeSinceLastR1 = this.getTimeSinceLastR1(userId);
    if (timeSinceLastR1 < 1800000) { // 30 минут
      return {
        shouldCall: false,
        reason: 'Recent R1 call'
      };
    }
    
    // 4. Проверяем условия для вызова R1
    
    // 4.1. Низкая уверенность V3 в нескольких сообщениях подряд
    if (metrics.highUncertainty && v3Result.confidence < 0.6) {
      return {
        shouldCall: true,
        reason: 'Low confidence pattern',
        delayMs: 5000 // Небольшая задержка
      };
    }
    
    // 4.2. Смешанные эмоции (близкие баллы у нескольких эмоций)
    if (metrics.emBlendScore < 2) {
      return {
        shouldCall: true,
        reason: 'Emotion blend detected',
        delayMs: 10000 // Средняя задержка
      };
    }
    
    // 4.3. Много коротких сообщений подряд
    if (metrics.shortStreak >= 5) {
      return {
        shouldCall: true,
        reason: 'Short message pattern',
        delayMs: 5000
      };
    }
    
    // 4.4. Большое сообщение с высокой токенизацией
    if (metrics.msgLen > 200 && metrics.rollingTokens > 1000) {
      return {
        shouldCall: true,
        reason: 'Complex message pattern',
        delayMs: 15000 // Большая задержка
      };
    }
    
    // 4.5. Много сообщений с последнего вызова R1
    if (metrics.sinceR1_msgs > 15 && metrics.sinceR1_min > 10) {
      return {
        shouldCall: true,
        reason: 'Session length threshold',
        delayMs: 10000
      };
    }
    
    // 5. По умолчанию не вызываем R1
    return {
      shouldCall: false,
      reason: 'No trigger conditions met'
    };
  }

  // Вычисление метрик для принятия решений
  calculateMetrics(
    userId: string,
    message: string,
    emBlendScore: number,
    confidence: number
  ): SessionMetrics {
    const stats = this.getOrCreateStats(userId);
    const history = this.messageHistory.get(userId) || [];
    
    // 1. Длина текущего сообщения
    const msgLen = message.length;
    
    // 2. Приблизительное количество токенов в последних сообщениях
    const rollingTokens = this.estimateRollingTokens(history);
    
    // 3. Количество коротких сообщений подряд
    const shortStreak = this.countShortMessagesStreak(history);
    
    // 4. Время и количество сообщений с последнего вызова R1
    const sinceR1_msgs = stats.metrics.sinceR1_msgs + 1;
    const sinceR1_min = Math.floor((Date.now() - stats.lastR1Call) / 60000);
    
    // 5. Флаг высокой неопределенности
    const highUncertainty = confidence < 0.7 && 
      (stats.metrics.highUncertainty || confidence < 0.5);
    
    const metrics: SessionMetrics = {
      msgLen,
      rollingTokens,
      shortStreak,
      sinceR1_msgs,
      sinceR1_min,
      emBlendScore,
      highUncertainty
    };
    
    // Обновляем статистику
    stats.metrics = metrics;
    this.stats.set(userId, stats);
    
    return metrics;
  }

  // Пометить, что R1 был вызван
  markR1Called(userId: string): void {
    const stats = this.getOrCreateStats(userId);
    
    stats.r1Calls++;
    stats.lastR1Call = Date.now();
    stats.metrics.sinceR1_msgs = 0;
    stats.metrics.sinceR1_min = 0;
    
    this.stats.set(userId, stats);
  }

  // Получить статистику
  getStats(userId: string): DecisionStats | null {
    return this.stats.get(userId) || null;
  }

  // Очистка старых данных
  cleanup(maxAge: number = 7200000): void { // 2 часа по умолчанию
    const now = Date.now();
    
    for (const [userId, stats] of this.stats.entries()) {
      if (now - stats.lastR1Call > maxAge) {
        this.stats.delete(userId);
        this.messageHistory.delete(userId);
      }
    }
  }

  // === Приватные методы ===

  private getOrCreateStats(userId: string): DecisionStats {
    let stats = this.stats.get(userId);
    
    if (!stats) {
      stats = {
        userId,
        r1Calls: 0,
        lastR1Call: Date.now() - 3600000, // Начинаем с -1 час
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
      this.stats.set(userId, stats);
    }
    
    return stats;
  }

  private updateMessageHistory(userId: string, message: Message): void {
    const history = this.messageHistory.get(userId) || [];
    history.push(message);
    
    // Храним только последние 50 сообщений
    if (history.length > 50) {
      this.messageHistory.set(userId, history.slice(-50));
    } else {
      this.messageHistory.set(userId, history);
    }
  }

  private updateStats(userId: string, metrics: SessionMetrics): void {
    const stats = this.getOrCreateStats(userId);
    stats.metrics = metrics;
    this.stats.set(userId, stats);
  }

  private getTimeSinceLastR1(userId: string): number {
    const stats = this.stats.get(userId);
    if (!stats) {
      return Infinity;
    }
    
    return Date.now() - stats.lastR1Call;
  }

  private estimateRollingTokens(messages: Message[]): number {
    // Простая эвристика: ~1 токен на 4 символа
    return messages
      .slice(-10)
      .reduce((sum, msg) => sum + Math.ceil(msg.content.length / 4), 0);
  }

  private countShortMessagesStreak(messages: Message[]): number {
    // Считаем количество последних сообщений подряд короче 20 символов
    let streak = 0;
    
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].content.length < 20 && messages[i].role === 'user') {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}
