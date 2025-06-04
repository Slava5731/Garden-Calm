import { EmotionCode } from './emotion';
export interface EmpathyState {
    scores: Record<EmotionCode, any>;
    lastDecay: number;
    suggestions: SuggestionHistory[];
}
export interface SuggestionHistory {
    timestamp: number;
    emotionCode: EmotionCode;
    accepted: boolean;
}
export interface SuggestionResult {
    shouldSuggest: boolean;
    emotionCode?: EmotionCode;
    reason?: string;
    confidence?: number;
}
//# sourceMappingURL=empathy.d.ts.map