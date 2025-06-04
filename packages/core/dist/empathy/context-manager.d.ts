import { DeltaSnapshot, RollingBrief, LongSummary, Message, EmotionCode, HaikuContext, R1Context, SessionMetrics } from '../types';
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
export declare class ContextManager {
    private sessions;
    constructor();
    addSnapshot(userId: string, snapshot: string, emotionCode: EmotionCode, messageId: string, confidence: number): Promise<void>;
    getHaikuContext(userId: string, currentHint?: string, currentInsight?: string): HaikuContext;
    getR1Context(userId: string, messages: Message[], metrics: SessionMetrics): R1Context;
    requestLongSummary(userId: string): Promise<string>;
    cleanupOldSessions(maxAge?: number): void;
    exportSession(userId: string): SessionMemory | null;
    private getOrCreateSession;
    private hasEmotionChanged;
    private shouldUpdateBrief;
    private shouldCreateSummary;
    private updateRollingBrief;
    private createLongSummary;
    private findDominantEmotion;
    private buildDetailedSnapshot;
}
export {};
//# sourceMappingURL=context-manager.d.ts.map