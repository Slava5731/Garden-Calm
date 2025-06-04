import { EmotionCode, EmotionConfig, EmotionPriority } from '../types/emotion';

// ⭐ CENTRAL SOURCE OF TRUTH - единственное место определения эмоций
export const EMOTION_MATRIX: Record<EmotionCode, EmotionConfig> = {
  AP: {
    emotion: 'Anxiety/Panic',
    priority: 'High',
    action: 'Offer help',
    humor: false,
    tone: 'Warm, steady',
    avoid: 'Dismiss fear',
    example: "I'm here. Let's breathe..."
  },
  SD: {
    emotion: 'Sadness/Emptiness',
    priority: 'Med',
    action: 'Wait + nudge',
    humor: false,
    tone: 'Soft, slow',
    avoid: 'Force cheer',
    example: "I'm with you. Silence is okay."
  },
  AN: {
    emotion: 'Anger/Irritation',
    priority: 'Med',
    action: 'Wait, reflect',
    humor: false,
    tone: 'Even, firm',
    avoid: 'Confront',
    example: "I see the anger. I'm listening."
  },
  GS: {
    emotion: 'Guilt/Shame',
    priority: 'Med',
    action: 'Gentle ask',
    humor: false,
    tone: 'Gentle, caring',
    avoid: 'Assign blame',
    example: "You're not bad. Talk when ready."
  },
  ST: {
    emotion: 'Stress/Tension',
    priority: 'Med',
    action: 'Offer break',
    humor: true,
    tone: 'Calm, grounded',
    avoid: 'Minimize',
    example: "Pause. One deep breath first."
  },
  BO: {
    emotion: 'Burn‑out/Fatigue',
    priority: 'Low',
    action: 'Offer rest',
    humor: false,
    tone: 'Whisper‑soft',
    avoid: 'Push productivity',
    example: "Rest. I'll keep quiet with you."
  },
  IN: {
    emotion: 'Insomnia',
    priority: 'Med',
    action: 'Lead',
    humor: false,
    tone: 'Lull, soft',
    avoid: 'Excite topic',
    example: "Lie back... feel the bed..."
  },
  SDO: {
    emotion: 'Self‑doubt',
    priority: 'Med',
    action: 'Ask + boost',
    humor: true,
    tone: 'Supportive, firm',
    avoid: 'Dismiss concern',
    example: "Let's list your wins..."
  },
  LN: {
    emotion: 'Loneliness',
    priority: 'High',
    action: 'Start chat',
    humor: true,
    tone: 'Friendly, warm',
    avoid: 'Question worth',
    example: "I'm glad to talk. How's today?"
  },
  BA: {
    emotion: 'Boredom/Apathy',
    priority: 'Med',
    action: 'Spark idea',
    humor: true,
    tone: 'Casual, playful',
    avoid: 'Shame inaction',
    example: "Try spotting 3 blue things."
  },
  CF: {
    emotion: 'Change fear',
    priority: 'Med',
    action: 'Guide plan',
    humor: false,
    tone: 'Steady, hopeful',
    avoid: 'Force optimism',
    example: "List what you control..."
  },
  MR: {
    emotion: 'Mindfulness wish',
    priority: 'High',
    action: 'Lead session',
    humor: false,
    tone: 'Calm, instruct',
    avoid: 'Lecture',
    example: "Close eyes. Notice breath..."
  },
  JG: {
    emotion: 'Joy/Gratitude',
    priority: 'Med',
    action: 'Mirror joy',
    humor: true,
    tone: 'Bright, joyful',
    avoid: 'Downplay joy',
    example: "Wonderful! Tell me the story."
  },
  HT: {
    emotion: 'Hurt/Resentment',
    priority: 'Med',
    action: 'Invite talk',
    humor: false,
    tone: 'Tender, affirming',
    avoid: 'Defend offender',
    example: "That hurt sounds deep. I'm here."
  },
  NT: {
    emotion: 'Neutral/Calm',
    priority: 'Low',
    action: 'Mirror tone',
    humor: true,
    tone: 'Simple, balanced',
    avoid: 'Overreach',
    example: "Glad to hear from you."
  },
  CN: {
    emotion: 'Confusion/Lost',
    priority: 'Med',
    action: 'Clarify',
    humor: true,
    tone: 'Calm, guiding',
    avoid: 'Flood details',
    example: "Could you clarify what worries you?"
  }
};

// Мапинг приоритетов в числовые значения для Empathy Meter
export const EMOTION_PRIORITY_VALUES: Record<EmotionPriority, number> = {
  'High': 3,
  'Med': 2,
  'Low': 1
};

// Пороги для Empathy Meter
export const EMPATHY_THRESHOLDS = {
  THR_BASE: 5,              // Базовый порог для предложения
  MARGIN: 2,                // Минимальный отрыв от второго места
  MIN_HITS: 2,              // Минимум повторений
  COOLDOWN: 1800000,        // 30 минут между предложениями
  DECAY_TIME: 300000,       // 5 минут для decay
  DECAY_RATE: 0.9           // Коэффициент угасания
};

// Критические эмоции для быстрого реагирования
export const CRITICAL_EMOTIONS: EmotionCode[] = ['AP', 'LN', 'MR'];

// Валидатор кода эмоции
export function isValidEmotionCode(code: string): code is EmotionCode {
  return code in EMOTION_MATRIX;
}

// Получить приоритетное значение эмоции
export function getEmotionPriorityValue(code: EmotionCode): number {
  const config = EMOTION_MATRIX[code];
  return EMOTION_PRIORITY_VALUES[config.priority];
}
