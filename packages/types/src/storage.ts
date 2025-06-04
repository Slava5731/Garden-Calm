/**
 * Интерфейс хранилища памяти для Garden Calm
 * Абстракция для различных реализаций хранилища (Memory, Redis, MongoDB)
 */
export interface IMemoryStore {
  // Получить сессию пользователя
  getSession(userId: string): any | null;
  
  // Создать новую сессию
  createSession(userId: string): any;
  
  // Получить или создать сессию
  getOrCreateSession(userId: string): any;
  
  // Добавить сообщение в историю
  addMessage(userId: string, message: any): void;
  
  // Получить последние сообщения
  getRecentMessages(userId: string, count?: number): any[];
  
  // Обновить текущую эмоцию
  updateCurrentEmotion(userId: string, emotion: string): void;
  
  // Обновить время последнего предложения медитации
  updateLastSuggestion(userId: string): void;
  
  // Обновить время последнего вызова R1
  updateLastR1Call(userId: string): void;
  
  // Обновить метрики сессии
  updateMetrics(userId: string, metrics: any): void;
  
  // Очистить старые сессии
  cleanup(): void;
  
  // Получить статистику хранилища
  getStats(): {
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    oldestSession: number;
    newestSession: number;
  };
}
