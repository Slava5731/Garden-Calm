import { EmotionCode, EmotionScore, V3Response, EmpathyState } from '../types';
import { 
  getEmotionPriorityValue, 
  EMPATHY_THRESHOLDS,
  CRITICAL_EMOTIONS 
} from '../emotion-matrix/matrix';

export class ScoringEngine {
  private states: Map<string, EmpathyState> = new Map();

  constructor() {}

  // Основной метод обновления баллов
  update(userId: string, v3Result: V3Response): EmotionScore {
    const state = this.getOrCreateState(userId);
    const now = Date.now();

    // 1. Применяем decay ко всем эмоциям
    this.applyDecay(state, now);

    // 2. Получаем или создаем счетчик для текущей эмоции
    const emotionScore = this.getOrCreateEmotionScore(state, v3Result.code);

    // 3. Вычисляем вес на основе приоритета и контекста
    const weight = this.calculateWeight(v3Result);

    // 4. Обновляем баллы
    emotionScore.value += weight;
    emotionScore.hits++;
    emotionScore.lastUpdated = now;

    // 5. Сохраняем состояние
    this.states.set(userId, state);

    return emotionScore;
  }

  // Получить текущие баллы
  getScores(userId: string): Record<EmotionCode, EmotionScore> {
    const state = this.states.get(userId);
    if (!state) {
      return {} as Record<EmotionCode, EmotionScore>;
    }

    // Применяем decay перед возвратом
    this.applyDecay(state, Date.now());
    return state.scores;
  }

  // Получить топ эмоцию
  getTopEmotion(userId: string): { code: EmotionCode; score: EmotionScore } | null {
    const scores = this.getScores(userId);
    let topEmotion: EmotionCode | null = null;
    let maxValue = 0;

    for (const [code, score] of Object.entries(scores)) {
      if (score.value > maxValue) {
        maxValue = score.value;
        topEmotion = code as EmotionCode;
      }
    }

    if (!topEmotion) return null;

    return {
      code: topEmotion,
      score: scores[topEmotion]
    };
  }

  // Получить вторую по значимости эмоцию
  getSecondEmotion(userId: string): { code: EmotionCode; score: EmotionScore } | null {
    const scores = this.getScores(userId);
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b.value - a.value);

    if (sorted.length < 2) return null;

    const [code, score] = sorted[1];
    return {
      code: code as EmotionCode,
      score
    };
  }

  // Проверить, является ли эмоция повторяющейся
  isRepeatedEmotion(userId: string, code: EmotionCode): boolean {
    const state = this.states.get(userId);
    if (!state) return false;

    const score = state.scores[code];
    return score ? score.hits >= 2 : false;
  }

  // Сбросить баллы после предложения медитации
  resetAfterSuggestion(userId: string): void {
    const state = this.states.get(userId);
    if (!state) return;

    // Сбрасываем только топовую эмоцию наполовину
    const top = this.getTopEmotion(userId);
    if (top) {
      state.scores[top.code].value = Math.floor(top.score.value / 2);
    }

    // Обновляем историю предложений
    state.suggestions.push({
      timestamp: Date.now(),
      emotionCode: top?.code || 'NT',
      accepted: false // будет обновлено позже
    });

    this.states.set(userId, state);
  }

  // Пометить, что пользователь принял предложение
  markSuggestionAccepted(userId: string): void {
    const state = this.states.get(userId);
    if (!state || state.suggestions.length === 0) return;

    const lastSuggestion = state.suggestions[state.suggestions.length - 1];
    lastSuggestion.accepted = true;

    this.states.set(userId, state);
  }

  // Получить время с последнего предложения
  getTimeSinceLastSuggestion(userId: string): number {
    const state = this.states.get(userId);
    if (!state || state.suggestions.length === 0) {
      return Infinity;
    }

    const lastSuggestion = state.suggestions[state.suggestions.length - 1];
    return Date.now() - lastSuggestion.timestamp;
  }

  // Очистить старые сессии
  cleanupOldSessions(maxAge: number = 7200000): void { // 2 часа по умолчанию
    const now = Date.now();
    
    for (const [userId, state] of this.states.entries()) {
      const lastActivity = Math.max(
        ...Object.values(state.scores).map(s => s.lastUpdated),
        state.lastDecay
      );

      if (now - lastActivity > maxAge) {
        this.states.delete(userId);
      }
    }
  }

  // === Приватные методы ===

  private getOrCreateState(userId: string): EmpathyState {
    let state = this.states.get(userId);
    if (!state) {
      state = {
        scores: {} as Record<EmotionCode, EmotionScore>,
        lastDecay: Date.now(),
        suggestions: []
      };
      this.states.set(userId, state);
    }
    return state;
  }

  private getOrCreateEmotionScore(state: EmpathyState, code: EmotionCode): EmotionScore {
    if (!state.scores[code]) {
      state.scores[code] = {
        value: 0,
        hits: 0,
        lastUpdated: Date.now()
      };
    }
    return state.scores[code];
  }

  private calculateWeight(v3Result: V3Response): number {
    const { code, confidence } = v3Result;
    
    // Базовый вес на основе приоритета
    let weight = getEmotionPriorityValue(code);

    // Модификаторы
    // 1. Учитываем уверенность V3
    weight *= (0.5 + confidence * 0.5); // от 50% до 100% веса

    // 2. Критические эмоции получают бонус
    if (CRITICAL_EMOTIONS.includes(code)) {
      weight *= 1.2;
    }

    // 3. Если эмоция повторяется в короткий промежуток - бонус
    // (это проверяется в update через isRepeatedEmotion)

    return weight;
  }

  private applyDecay(state: EmpathyState, now: number): void {
    const timeSinceDecay = now - state.lastDecay;
    
    // Применяем decay каждые DECAY_TIME миллисекунд
    if (timeSinceDecay < EMPATHY_THRESHOLDS.DECAY_TIME) {
      return;
    }

    const decayPeriods = Math.floor(timeSinceDecay / EMPATHY_THRESHOLDS.DECAY_TIME);
    const decayFactor = Math.pow(EMPATHY_THRESHOLDS.DECAY_RATE, decayPeriods);

    // Применяем decay ко всем эмоциям
    for (const score of Object.values(state.scores)) {
      score.value *= decayFactor;
      
      // Обнуляем очень маленькие значения
      if (score.value < 0.1) {
        score.value = 0;
      }
    }

    state.lastDecay = now;
  }

  // Экспорт состояния для отладки
  exportState(userId: string): EmpathyState | null {
    return this.states.get(userId) || null;
  }

  // Импорт состояния (для тестов)
  importState(userId: string, state: EmpathyState): void {
    this.states.set(userId, state);
  }
}
