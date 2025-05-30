/**
 * Классификатор эмоций для Garden Calm
 * 
 * Rule-based система для быстрого определения эмоционального состояния
 * пользователя на основе текстового сообщения.
 */

import { Emotion, EmotionTone } from '@gc/types';

/**
 * Интерфейс для результата классификации сообщения
 */
export interface ClassificationResult {
  /**
   * Определенный тип эмоции
   */
  emotion: Emotion;
  
  /**
   * Требуется ли глубокий анализ через DeepSeek
   */
  needsDeepAnalysis: boolean;
}

/**
 * Интерфейс для паттерна эмоций
 */
interface EmotionPattern {
  /**
   * Регулярное выражение для поиска в тексте
   */
  regex: RegExp;
  
  /**
   * Вес паттерна (влияет на score)
   */
  weight: number;
  
  /**
   * Тип эмоции, связанный с паттерном
   */
  tone: EmotionTone;
  
  /**
   * Критичность паттерна (влияет на needsDeepAnalysis)
   */
  critical?: boolean;
}

/**
 * Критические паттерны, требующие глубокого анализа
 */
const CRITICAL_PATTERNS: EmotionPattern[] = [
  { regex: /умереть|суицид|покончить с собой|не хочу жить/i, weight: 10, tone: 'sad', critical: true },
  { regex: /паническ[а-я]+ атак[а-я]+|не могу дышать|задыха[а-я]+с[а-я]+/i, weight: 8, tone: 'anxious', critical: true },
  { regex: /ненавижу (себя|всех|жизнь)|хочу убить/i, weight: 9, tone: 'angry', critical: true },
  { regex: /бессмысленно|пустота|никчемн[а-я]+/i, weight: 7, tone: 'sad', critical: true },
  { regex: /страшно|боюсь|ужас|кошмар/i, weight: 6, tone: 'anxious', critical: true }
];

/**
 * Паттерны для определения негативных эмоций
 */
const NEGATIVE_PATTERNS: EmotionPattern[] = [
  { regex: /грустно|печаль|тоска|уныни[а-я]+/i, weight: 5, tone: 'sad' },
  { regex: /тревог[а-я]+|волну[а-я]+с[а-я]+|беспоко[а-я]+с[а-я]+/i, weight: 5, tone: 'anxious' },
  { regex: /зл[а-я]+|раздраж[а-я]+|бес[а-я]+т|ярост[а-я]+/i, weight: 5, tone: 'angry' },
  { regex: /устал[а-я]*|измотан[а-я]*|нет сил/i, weight: 4, tone: 'negative' },
  { regex: /разочарова[а-я]+|обид[а-я]+|жал[а-я]+/i, weight: 4, tone: 'sad' },
  { regex: /переживаю|нервничаю|стресс|напряжение/i, weight: 5, tone: 'anxious' },
  { regex: /боюсь|страшно|опасаюсь|предстоящее/i, weight: 5, tone: 'anxious' },
  { regex: /собеседование|экзамен|выступление|встреча/i, weight: 3, tone: 'anxious' },
  { regex: /зол|ненавижу|раздражает|достал/i, weight: 5, tone: 'angry' }
];

/**
 * Паттерны для определения позитивных эмоций
 */
const POSITIVE_PATTERNS: EmotionPattern[] = [
  { regex: /счастлив[а-я]*|радост[а-я]+|весел[а-я]+/i, weight: 5, tone: 'positive' },
  { regex: /благодар[а-я]+|признател[а-я]+/i, weight: 4, tone: 'positive' },
  { regex: /спокойн[а-я]+|умиротворен[а-я]+/i, weight: 4, tone: 'positive' },
  { regex: /вдохновл[а-я]+|мотивирова[а-я]+/i, weight: 5, tone: 'excited' },
  { regex: /энерги[а-я]+|бодр[а-я]+|сил[а-я]+/i, weight: 4, tone: 'excited' },
  { regex: /прекрасно|отлично|замечательно|супер|класс/i, weight: 5, tone: 'positive' },
  { regex: /хорошо|здорово|великолепно|чудесно/i, weight: 4, tone: 'positive' },
  { regex: /люблю|нравится|доволен|удовлетворен/i, weight: 4, tone: 'positive' }
];

/**
 * Паттерны для определения нейтральных эмоций
 */
const NEUTRAL_PATTERNS: EmotionPattern[] = [
  { regex: /нормально|обычно|как всегда/i, weight: 3, tone: 'neutral' },
  { regex: /средне|так себе|ничего особенного/i, weight: 3, tone: 'neutral' }
];

/**
 * Все паттерны для анализа
 */
const ALL_PATTERNS: EmotionPattern[] = [
  ...CRITICAL_PATTERNS,
  ...NEGATIVE_PATTERNS,
  ...POSITIVE_PATTERNS,
  ...NEUTRAL_PATTERNS
];

/**
 * Классифицирует сообщение пользователя
 * 
 * @param message Текст сообщения пользователя
 * @returns Результат классификации с определенной эмоцией и флагом необходимости глубокого анализа
 */
export async function classifyMessage(message: string): Promise<ClassificationResult> {
  // Инициализация результата с нейтральной эмоцией
  const result: ClassificationResult = {
    emotion: {
      tone: 'neutral',
      score: 0,
      confidence: 0,
      keywords: []
    },
    needsDeepAnalysis: false
  };
  
  // Если сообщение пустое, возвращаем нейтральную эмоцию
  if (!message || message.trim().length === 0) {
    return result;
  }
  
  // Нормализация текста
  const normalizedMessage = message.toLowerCase().trim();
  
  // Массив для хранения найденных ключевых слов
  const foundKeywords: string[] = [];
  
  // Счетчики для разных типов эмоций
  const toneScores: Record<EmotionTone, number> = {
    positive: 0,
    negative: 0,
    neutral: 0,
    anxious: 0,
    sad: 0,
    angry: 0,
    excited: 0
  };
  
  // Проверка на критические паттерны
  let hasCriticalPattern = false;
  
  // Проходим по всем паттернам
  ALL_PATTERNS.forEach(pattern => {
    const matches = normalizedMessage.match(pattern.regex);
    
    if (matches) {
      // Добавляем найденные ключевые слова
      matches.forEach(match => {
        if (match && !foundKeywords.includes(match)) {
          foundKeywords.push(match);
        }
      });
      
      // Увеличиваем счетчик для соответствующего тона
      toneScores[pattern.tone] += pattern.weight;
      
      // Проверяем на критичность
      if (pattern.critical) {
        hasCriticalPattern = true;
      }
    }
  });
  
  // Определяем доминирующий тон
  let dominantTone: EmotionTone = 'neutral';
  let maxScore = 0;
  
  Object.entries(toneScores).forEach(([tone, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantTone = tone as EmotionTone;
    }
  });
  
  // Если нет явного доминирующего тона, оставляем нейтральный
  if (maxScore === 0) {
    return result;
  }
  
  // Нормализуем score до шкалы 0-100
  const normalizedScore = Math.min(Math.round(maxScore * 10), 100);
  
  // Рассчитываем уверенность на основе разницы между максимальным и средним значением
  const totalScores = Object.values(toneScores).reduce((sum, score) => sum + score, 0);
  const avgScore = totalScores / Object.keys(toneScores).length;
  const confidence = maxScore > 0 ? Math.min((maxScore - avgScore) / maxScore, 1) : 0;
  
  // Формируем результат
  result.emotion = {
    tone: dominantTone,
    score: normalizedScore,
    confidence: parseFloat(confidence.toFixed(2)),
    keywords: foundKeywords
  };
  
  // Определяем необходимость глубокого анализа
  result.needsDeepAnalysis = hasCriticalPattern || normalizedScore >= 70 || confidence < 0.4;
  
  return result;
}

/**
 * Проверяет, нужен ли глубокий анализ на основе текущей и предыдущей классификации
 * 
 * @param current Текущий результат классификации
 * @param previous Предыдущий результат классификации (если есть)
 * @returns true, если нужен глубокий анализ
 */
export function needsDeepAnalysis(
  current: ClassificationResult,
  previous?: ClassificationResult
): boolean {
  // Если текущая классификация требует глубокого анализа
  if (current.needsDeepAnalysis) {
    return true;
  }
  
  // Если нет предыдущей классификации
  if (!previous) {
    return false;
  }
  
  // Проверяем резкое изменение эмоционального состояния
  const scoreDifference = Math.abs(current.emotion.score - previous.emotion.score);
  if (scoreDifference >= 30) {
    return true;
  }
  
  // Проверяем изменение тона эмоции
  if (current.emotion.tone !== previous.emotion.tone && 
      current.emotion.confidence > 0.6 && 
      previous.emotion.confidence > 0.6) {
    return true;
  }
  
  return false;
}

/**
 * Тестирует классификатор на наборе примеров
 * 
 * @param examples Массив тестовых сообщений
 * @returns Результаты классификации для каждого примера
 */
export async function testClassifier(examples: string[]): Promise<ClassificationResult[]> {
  const results: ClassificationResult[] = [];
  
  for (const example of examples) {
    const result = await classifyMessage(example);
    results.push(result);
  }
  
  return results;
}
