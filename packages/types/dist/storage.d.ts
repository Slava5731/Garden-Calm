/**
 * Интерфейс хранилища памяти для Garden Calm
 * Абстракция для различных реализаций хранилища (Memory, Redis, MongoDB)
 */
export interface IMemoryStore {
    getSession(userId: string): any | null;
    createSession(userId: string): any;
    getOrCreateSession(userId: string): any;
    addMessage(userId: string, message: any): void;
    getRecentMessages(userId: string, count?: number): any[];
    updateCurrentEmotion(userId: string, emotion: string): void;
    updateLastSuggestion(userId: string): void;
    updateLastR1Call(userId: string): void;
    updateMetrics(userId: string, metrics: any): void;
    cleanup(): void;
    getStats(): {
        totalSessions: number;
        totalMessages: number;
        averageMessagesPerSession: number;
        oldestSession: number;
        newestSession: number;
    };
}
//# sourceMappingURL=storage.d.ts.map