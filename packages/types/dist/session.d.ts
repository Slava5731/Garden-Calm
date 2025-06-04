import { EmotionCode } from './emotion';
export interface Message {
    id: string;
    userId: string;
    content: string;
    timestamp: number;
    role: 'user' | 'assistant';
    emotionCode?: EmotionCode;
}
export interface SessionMetrics {
    msgLen: number;
    rollingTokens: number;
    shortStreak: number;
    sinceR1_msgs: number;
    sinceR1_min: number;
    emBlendScore: number;
    highUncertainty: boolean;
}
export interface SessionState {
    userId: string;
    messages: Message[];
    currentEmotion: EmotionCode;
    emotionScores: Record<EmotionCode, any>;
    lastSuggestion: number;
    lastR1Call: number;
    sessionStart: number;
    metrics: SessionMetrics;
}
//# sourceMappingURL=session.d.ts.map