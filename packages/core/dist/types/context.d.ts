import { EmotionCode } from './emotion';
export interface DeltaSnapshot {
    timestamp: number;
    content: string;
    emotionCode: EmotionCode;
    messageId: string;
}
export interface RollingBrief {
    content: string;
    timestamp: number;
    messageCount: number;
    dominantEmotion: EmotionCode;
}
export interface LongSummary {
    content: string;
    timestamp: number;
    sessionDuration: number;
    emotionalJourney: EmotionCode[];
    keyInsights: string[];
}
export interface BriefTriggers {
    messageCount: number;
    emotionChange: boolean;
    timeElapsed: number;
    empathyScore: number;
}
export interface SummaryTriggers {
    briefCount: number;
    sessionTime: number;
    emotionPeaks: number;
    beforeMeditation: boolean;
}
//# sourceMappingURL=context.d.ts.map