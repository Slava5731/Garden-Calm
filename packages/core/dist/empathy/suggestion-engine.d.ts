import { EmotionCode, V3Response, SuggestionResult } from '../types';
import { ScoringEngine } from './scoring-engine';
export declare class SuggestionEngine {
    private scoringEngine;
    private lastSuggestions;
    private suggestionHistory;
    constructor(scoringEngine: ScoringEngine);
    shouldSuggestMeditation(userId: string, v3Result: V3Response): SuggestionResult;
    analyzeMeditationReadiness(userId: string): {
        isReady: boolean;
        reason?: string;
        score?: number;
    };
    getRecommendedEmotions(userId: string, limit?: number): EmotionCode[];
    onSuggestionAccepted(userId: string): void;
    onSuggestionDeclined(userId: string): void;
    private getTimeSinceLastSuggestion;
    private updateSuggestionHistory;
    private calculateAcceptanceRate;
}
//# sourceMappingURL=suggestion-engine.d.ts.map