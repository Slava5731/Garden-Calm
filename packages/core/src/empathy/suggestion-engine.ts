import { 
  EmotionCode, 
  V3Response, 
  SuggestionResult,
  SuggestionHistory
} from '../types';
import { ScoringEngine } from './scoring-engine';
import { 
  EMOTION_MATRIX, 
  EMPATHY_THRESHOLDS,
  CRITICAL_EMOTIONS 
} from '../emotion-matrix/matrix';

export class SuggestionEngine {
  private scoringEngine: ScoringEngine;
  private lastSuggestions: Map<string, number> = new Map();
  private suggestionHistory: Map<string, SuggestionHistory[]> = new Map();

  constructor(scoringEngine: ScoringEngine) {
    this.scoringEngine = scoringEngine;
  }

  // Основной метод проверки необходимости предложить медитацию
  shouldSuggestMeditation(userId: string, v3Result: V3Response): SuggestionResult {
    // 1. Проверяем готовность к медитации
    const readiness = this.analyzeMeditationReadiness(userId);
    
    if (!readiness.isReady) {
      return {
        shouldSuggest: false,
        reason: readiness.reason
      };
    }

    // 2. Получаем топовую эмоцию
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    if (!topEmotion) {
      return {
        shouldSuggest: false,
        reason: 'No dominant emotion'
      };
    }

    // 3. Проверяем, достаточно ли сильна эта эмоция
    const secondEmotion = this.scoringEngine.getSecondEmotion(userId);
    const margin = secondEmotion 
      ? topEmotion.score.value - secondEmotion.score.value 
      : topEmotion.score.value;

    if (topEmotion.score.value < EMPATHY_THRESHOLDS.THR_BASE) {
      return {
        shouldSuggest: false,
        reason: 'Emotion score too low'
      };
    }

    if (margin < EMPATHY_THRESHOLDS.MARGIN) {
      return {
        shouldSuggest: false,
        reason: 'Emotion margin too small'
      };
    }

    // 4. Проверяем, повторяется ли эта эмоция
    const isRepeated = this.scoringEngine.isRepeatedEmotion(
      userId, 
      topEmotion.code
    );

    if (!isRepeated && !CRITICAL_EMOTIONS.includes(topEmotion.code)) {
      return {
        shouldSuggest: false,
        reason: 'Emotion not repeated'
      };
    }

    // 5. Проверяем, прошло ли достаточно времени с последнего предложения
    const timeSinceLastSuggestion = this.getTimeSinceLastSuggestion(userId);
    if (timeSinceLastSuggestion < EMPATHY_THRESHOLDS.COOLDOWN) {
      return {
        shouldSuggest: false,
        reason: 'Cooldown period active'
      };
    }

    // 6. Если все условия выполнены, предлагаем медитацию
    return {
      shouldSuggest: true,
      emotionCode: topEmotion.code,
      confidence: v3Result.confidence,
      reason: `${EMOTION_MATRIX[topEmotion.code].emotion} detected`
    };
  }

  // Анализ готовности к медитации
  analyzeMeditationReadiness(userId: string): {
    isReady: boolean;
    reason?: string;
    score?: number;
  } {
    // 1. Проверяем, прошло ли достаточно времени с последнего предложения
    const timeSinceLastSuggestion = this.getTimeSinceLastSuggestion(userId);
    if (timeSinceLastSuggestion < EMPATHY_THRESHOLDS.COOLDOWN) {
      return {
        isReady: false,
        reason: 'Recent suggestion',
        score: 0
      };
    }

    // 2. Проверяем историю принятия предложений
    const acceptanceRate = this.calculateAcceptanceRate(userId);
    const historyLength = this.suggestionHistory.get(userId)?.length ?? 0;
    if (acceptanceRate < 0.3 && historyLength >= 3) {
      return {
        isReady: false,
        reason: 'Low acceptance rate',
        score: acceptanceRate
      };
    }

    // 3. Проверяем наличие сильной эмоции
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    if (!topEmotion || topEmotion.score.value < EMPATHY_THRESHOLDS.THR_BASE) {
      return {
        isReady: false,
        reason: 'No strong emotion',
        score: topEmotion?.score.value || 0
      };
    }

    // 4. Если все условия выполнены, пользователь готов к медитации
    return {
      isReady: true,
      score: topEmotion.score.value
    };
  }

  // Получить рекомендуемые эмоции для медитации
  getRecommendedEmotions(userId: string, limit: number = 3): EmotionCode[] {
    const scores = this.scoringEngine.getScores(userId);
    
    // Сортируем эмоции по баллам
    const sortedEmotions = Object.entries(scores)
      .sort(([, a], [, b]) => b.value - a.value)
      .filter(([, score]) => score.value > 0)
      .map(([code]) => code as EmotionCode);
    
    return sortedEmotions.slice(0, limit);
  }

  // Обработка принятия предложения медитации
  onSuggestionAccepted(userId: string): void {
    // 1. Обновляем историю предложений
    this.updateSuggestionHistory(userId, true);
    
    // 2. Сбрасываем баллы после принятия
    this.scoringEngine.resetAfterSuggestion(userId);
    
    // 3. Обновляем время последнего предложения
    this.lastSuggestions.set(userId, Date.now());
  }

  // Обработка отклонения предложения медитации
  onSuggestionDeclined(userId: string): void {
    // 1. Обновляем историю предложений
    this.updateSuggestionHistory(userId, false);
    
    // 2. Обновляем время последнего предложения
    this.lastSuggestions.set(userId, Date.now());
  }

  // === Приватные методы ===

  private getTimeSinceLastSuggestion(userId: string): number {
    const lastSuggestion = this.lastSuggestions.get(userId);
    if (!lastSuggestion) {
      return Infinity;
    }
    
    return Date.now() - lastSuggestion;
  }

  private updateSuggestionHistory(userId: string, accepted: boolean): void {
    const history = this.suggestionHistory.get(userId) || [];
    const topEmotion = this.scoringEngine.getTopEmotion(userId);
    
    history.push({
      timestamp: Date.now(),
      emotionCode: topEmotion?.code || 'NT',
      accepted
    });
    
    // Храним только последние 10 предложений
    if (history.length > 10) {
      history.shift();
    }
    
    this.suggestionHistory.set(userId, history);
  }

  private calculateAcceptanceRate(userId: string): number {
    const history = this.suggestionHistory.get(userId);
    if (!history || history.length === 0) {
      return 1; // По умолчанию считаем, что пользователь примет предложение
    }
    
    const accepted = history.filter(h => h.accepted).length;
    return accepted / history.length;
  }
}
