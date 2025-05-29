/**
 * Типы эмоций для анализа в Garden Calm
 */

/**
 * Тип эмоции, определяемый анализатором
 */
export type EmotionTone = 'positive' | 'negative' | 'neutral' | 'anxious' | 'sad' | 'angry' | 'excited';

/**
 * Интерфейс для представления эмоции
 */
export interface Emotion {
  /**
   * Тип эмоционального тона
   */
  tone: EmotionTone;
  
  /**
   * Оценка интенсивности эмоции по шкале от 0 до 100
   */
  score: number;
  
  /**
   * Уровень уверенности в определении эмоции (от 0 до 1)
   */
  confidence: number;
  
  /**
   * Ключевые слова, которые привели к определению данной эмоции
   */
  keywords: string[];
}
