import { Message, SessionState, EmotionCode, SessionMetrics, IMemoryStore } from '@garden-calm/types';
/**
 * Временная реализация IMemoryStore для использования внутри core
 * В дальнейшем будет заменена на фабрику из @garden-calm/storage
 */
export declare class InMemoryMemoryStore implements IMemoryStore {
    private sessions;
    getSession(userId: string): SessionState | null;
    createSession(userId: string): SessionState;
    getOrCreateSession(userId: string): SessionState;
    addMessage(userId: string, message: Message): void;
    getRecentMessages(userId: string, count?: number): Message[];
    updateCurrentEmotion(userId: string, emotion: EmotionCode): void;
    updateLastSuggestion(userId: string): void;
    updateLastR1Call(userId: string): void;
    updateMetrics(userId: string, metrics: SessionMetrics): void;
    cleanup(): void;
    getStats(): {
        totalSessions: number;
        totalMessages: number;
        averageMessagesPerSession: number;
        oldestSession: number;
        newestSession: number;
    };
}
//# sourceMappingURL=in-memory-store.d.ts.map