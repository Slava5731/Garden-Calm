import { EmotionCode, EmotionScore } from './emotion';
import { Message, SessionMetrics } from './session';

export interface V3Response {
  code: EmotionCode;
  confidence: number;
  hint: string;
  insight: string;
  snapshot: string;
}

export interface HaikuContext {
  recentMessages: Message[];
  briefSnapshot: string;
  emotionalState: EmotionCode;
  currentHint?: string;
  currentInsight?: string;
}

export interface R1Context {
  fullHistory: Message[];
  emotionalTimeline: EmotionPoint[];
  detailedSnapshot: string;
  sessionMetrics: SessionMetrics;
}

export interface EmotionPoint {
  timestamp: number;
  code: EmotionCode;
  confidence: number;
  message: string;
}
