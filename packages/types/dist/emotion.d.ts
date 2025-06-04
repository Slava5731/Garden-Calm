export type EmotionCode = 'AP' | 'SD' | 'AN' | 'GS' | 'ST' | 'BO' | 'IN' | 'SDO' | 'LN' | 'BA' | 'CF' | 'MR' | 'JG' | 'HT' | 'NT' | 'CN';
export type EmotionPriority = 'High' | 'Med' | 'Low';
export interface EmotionConfig {
    emotion: string;
    priority: EmotionPriority;
    action: string;
    humor: boolean;
    tone: string;
    avoid: string;
    example: string;
}
export interface EmotionScore {
    value: number;
    hits: number;
    lastUpdated: number;
}
//# sourceMappingURL=emotion.d.ts.map