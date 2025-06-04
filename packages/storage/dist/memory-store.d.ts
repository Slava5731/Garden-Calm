import { Message, SessionState, EmotionCode, SessionMetrics, IMemoryStore } from '@garden-calm/types';
export interface MemoryStoreConfig {
    type?: 'memory' | 'redis' | 'mongo';
    ttl?: number;
}
export declare class MemoryStore implements IMemoryStore {
    private sessions;
    private config;
    constructor(config?: MemoryStoreConfig);
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
//# sourceMappingURL=memory-store.d.ts.map