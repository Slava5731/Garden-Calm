/**
 * Типы медитаций для Garden Calm
 */

import { EmotionTone } from './emotion.types';

/**
 * Категории медитаций
 */
export type MeditationCategory = 'anxiety' | 'sleep' | 'focus' | 'relaxation' | 'energy';

/**
 * Уровни сложности медитаций
 */
export type MeditationDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Интерфейс для представления медитации
 */
export interface Meditation {
  /**
   * Уникальный идентификатор медитации
   */
  id: string;
  
  /**
   * Название медитации
   */
  title: string;
  
  /**
   * Описание медитации
   */
  description: string;
  
  /**
   * Продолжительность медитации в минутах
   */
  duration: number;
  
  /**
   * Категория медитации
   */
  category: MeditationCategory;
  
  /**
   * Эмоциональные теги, для которых подходит данная медитация
   */
  emotionTags: EmotionTone[];
  
  /**
   * URL аудиофайла медитации (опционально)
   */
  audioUrl?: string;
  
  /**
   * URL изображения для медитации (опционально)
   */
  imageUrl?: string;
  
  /**
   * Уровень сложности медитации
   */
  difficulty: MeditationDifficulty;
}
