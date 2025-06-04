import { Message, SessionMetrics } from '../types';
import { V3Response } from '../types/ai';
interface DecisionStats {
    userId: string;
    r1Calls: number;
    lastR1Call: number;
    metrics: SessionMetrics;
}
export declare class DecisionEngine {
    private stats;
    private messageHistory;
    constructor();
    shouldCallR1(userId: string, metrics: SessionMetrics, v3Result: V3Response, message: Message): {
        shouldCall: boolean;
        reason?: string;
        delayMs?: number;
    };
    calculateMetrics(userId: string, message: string, emBlendScore: number, confidence: number): SessionMetrics;
    markR1Called(userId: string): void;
    getStats(userId: string): DecisionStats | null;
    cleanup(maxAge?: number): void;
    private getOrCreateStats;
    private updateMessageHistory;
    private updateStats;
    private getTimeSinceLastR1;
    private estimateRollingTokens;
    private countShortMessagesStreak;
}
export {};
//# sourceMappingURL=decision-engine.d.ts.map