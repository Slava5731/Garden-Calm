import { EmotionCode, EmotionScore, V3Response, EmpathyState } from '../types';
export declare class ScoringEngine {
    private states;
    constructor();
    update(userId: string, v3Result: V3Response): EmotionScore;
    getScores(userId: string): Record<EmotionCode, EmotionScore>;
    getTopEmotion(userId: string): {
        code: EmotionCode;
        score: EmotionScore;
    } | null;
    getSecondEmotion(userId: string): {
        code: EmotionCode;
        score: EmotionScore;
    } | null;
    isRepeatedEmotion(userId: string, code: EmotionCode): boolean;
    resetAfterSuggestion(userId: string): void;
    markSuggestionAccepted(userId: string): void;
    getTimeSinceLastSuggestion(userId: string): number;
    cleanupOldSessions(maxAge?: number): void;
    private getOrCreateState;
    private getOrCreateEmotionScore;
    private calculateWeight;
    private applyDecay;
    exportState(userId: string): EmpathyState | null;
    importState(userId: string, state: EmpathyState): void;
}
//# sourceMappingURL=scoring-engine.d.ts.map