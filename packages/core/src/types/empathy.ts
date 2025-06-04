import { EmotionCode, EmotionScore } from './emotion';

export interface EmpathyState {
  scores: Record<EmotionCode, EmotionScore>;
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
