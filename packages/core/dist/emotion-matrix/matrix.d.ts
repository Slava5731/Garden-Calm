import { EmotionCode, EmotionConfig, EmotionPriority } from '../types/emotion';
export declare const EMOTION_MATRIX: Record<EmotionCode, EmotionConfig>;
export declare const EMOTION_PRIORITY_VALUES: Record<EmotionPriority, number>;
export declare const EMPATHY_THRESHOLDS: {
    THR_BASE: number;
    MARGIN: number;
    MIN_HITS: number;
    COOLDOWN: number;
    DECAY_TIME: number;
    DECAY_RATE: number;
};
export declare const CRITICAL_EMOTIONS: EmotionCode[];
export declare function isValidEmotionCode(code: string): code is EmotionCode;
export declare function getEmotionPriorityValue(code: EmotionCode): number;
//# sourceMappingURL=matrix.d.ts.map