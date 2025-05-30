/**
 * DeepSeek Worker для Garden Calm
 * 
 * Анализирует эмоциональное состояние пользователя на основе сообщений.
 * Локальная реализация с моками для разработки без внешних API.
 */

import { EmotionSnapshot, Emotion, EmotionTone } from '@gc/types';
import { Message } from '@gc/types';

/**
 * Интерфейс для задачи анализа эмоций
 */
interface AnalysisTask {
  /**
   * Уникальный идентификатор пользователя
   */
  userId: string;
  
  /**
   * Сообщения для анализа
   */
  messages: Message[];
  
  /**
   * Текущий снапшот (если есть)
   */
  currentSnapshot?: EmotionSnapshot;
  
  /**
   * Временная метка создания задачи
   */
  createdAt: number;
}

/**
 * Простая очередь для задач анализа эмоций
 */
class AnalysisQueue {
  private queue: AnalysisTask[] = [];
  private processing: boolean = false;
  
  /**
   * Добавляет задачу в очередь
   * @param task Задача для анализа
   */
  async push(task: AnalysisTask): Promise<void> {
    this.queue.push(task);
    console.log(`[AnalysisQueue] Задача добавлена в очередь. Длина очереди: ${this.queue.length}`);
    
    if (!this.processing) {
      this.processQueue();
    }
  }
  
  /**
   * Обрабатывает задачи в очереди
   */
  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    const task = this.queue.shift();
    
    if (!task) {
      this.processing = false;
      return;
    }
    
    console.log(`[AnalysisQueue] Обработка задачи для пользователя ${task.userId}`);
    
    try {
      // Анализируем эмоции
      const snapshot = await analyzeEmotions(task.messages, task.currentSnapshot);
      
      // В реальном приложении здесь был бы код для сохранения снапшота в Redis
      // и отправки уведомления через WebSocket
      console.log(`[AnalysisQueue] Анализ завершен для пользователя ${task.userId}`);
      console.log(`[AnalysisQueue] Доминирующая эмоция: ${snapshot.dominantEmotion.tone}`);
      
      // Имитируем задержку обработки
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`[AnalysisQueue] Ошибка при обработке задачи:`, error);
    }
    
    // Продолжаем обработку очереди
    this.processQueue();
  }
  
  /**
   * Возвращает текущую длину очереди
   */
  getQueueLength(): number {
    return this.queue.length;
  }
}

/**
 * Экспортируем очередь для использования в приложении
 */
export const analysisQueue = new AnalysisQueue();

/**
 * Анализирует эмоции на основе сообщений
 * @param messages Сообщения для анализа
 * @param currentSnapshot Текущий снапшот (если есть)
 * @returns Обновленный эмоциональный снапшот
 */
export async function analyzeEmotions(
  messages: Message[],
  currentSnapshot?: EmotionSnapshot
): Promise<EmotionSnapshot> {
  // В реальном приложении здесь был бы код для вызова DeepSeek API
  // В локальной разработке используем мок-анализ
  return mockAnalyzeEmotions(messages, currentSnapshot);
}

/**
 * Мок-реализация анализа эмоций для локальной разработки
 * @param messages Сообщения для анализа
 * @param currentSnapshot Текущий снапшот (если есть)
 * @returns Обновленный эмоциональный снапшот
 */
async function mockAnalyzeEmotions(
  messages: Message[],
  currentSnapshot?: EmotionSnapshot
): Promise<EmotionSnapshot> {
  // Базовый снапшот
  const baseSnapshot: EmotionSnapshot = currentSnapshot || {
    userId: 'default',
    emotions: [],
    dominantEmotion: {
      tone: 'neutral',
      score: 50,
      confidence: 0.5,
      keywords: []
    },
    messageCount: 0,
    timestamp: new Date(),
    lastUpdated: new Date()
  };
  
  // Если нет сообщений, возвращаем текущий снапшот
  if (messages.length === 0) {
    return baseSnapshot;
  }
  
  // Анализируем только последние 5 сообщений
  const recentMessages = messages.slice(-5);
  
  // Определяем доминирующую эмоцию на основе ключевых слов
  const dominantEmotion = detectDominantEmotion(recentMessages);
  
  // Определяем все эмоции
  const emotions = [dominantEmotion];
  
  // Генерируем промпт на основе эмоции
  const prompt = generatePromptFromEmotion(dominantEmotion);
  
  // Формируем обновленный снапшот
  return {
    userId: baseSnapshot.userId,
    emotions,
    dominantEmotion,
    messageCount: (baseSnapshot.messageCount || 0) + 1,
    timestamp: new Date(),
    lastUpdated: new Date(),
    prompt
  };
}

/**
 * Определяет доминирующую эмоцию на основе сообщений
 * @param messages Сообщения для анализа
 * @returns Доминирующая эмоция
 */
function detectDominantEmotion(messages: Message[]): Emotion {
  // Объединяем все сообщения пользователя
  const userContent = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content.toLowerCase())
    .join(' ');
  
  // Словарь ключевых слов для каждой эмоции
  const emotionKeywords: Record<string, string[]> = {
    positive: ['счастлив', 'рад', 'доволен', 'благодарен', 'отлично', 'прекрасно', 'замечательно', 'супер', 'класс'],
    negative: ['плохо', 'ужасно', 'отвратительно', 'неприятно', 'разочарован', 'грустно', 'печально'],
    anxious: ['тревога', 'беспокойство', 'волнение', 'страх', 'боюсь', 'переживаю', 'нервничаю', 'стресс'],
    sad: ['грусть', 'печаль', 'тоска', 'уныние', 'депрессия', 'подавлен', 'одиночество'],
    angry: ['злость', 'гнев', 'раздражение', 'бешенство', 'ярость', 'ненависть', 'бесит'],
    excited: ['восторг', 'возбуждение', 'энтузиазм', 'воодушевление', 'предвкушение'],
    neutral: ['нормально', 'обычно', 'стандартно', 'как обычно', 'ничего особенного']
  };
  
  // Подсчитываем количество совпадений для каждой эмоции
  const emotionScores: Record<string, number> = {};
  
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    emotionScores[emotion] = keywords.reduce((score, keyword) => {
      return score + (userContent.includes(keyword) ? 1 : 0);
    }, 0);
  }
  
  // Определяем доминирующую эмоцию
  let dominantEmotion: EmotionTone = 'neutral';
  let maxScore = 0;
  
  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > maxScore) {
      maxScore = score;
      // Приводим к типу EmotionTone
      dominantEmotion = emotion as EmotionTone;
    }
  }
  
  // Если нет явных эмоций, используем нейтральную
  if (maxScore === 0) {
    dominantEmotion = 'neutral';
  }
  
  // Определяем ключевые слова, которые были найдены
  const foundKeywords = emotionKeywords[dominantEmotion].filter(keyword => 
    userContent.includes(keyword)
  );
  
  // Вычисляем интенсивность эмоции (от 0 до 100)
  const intensity = Math.min(100, Math.max(50, 50 + maxScore * 10));
  
  // Вычисляем уверенность в определении эмоции (от 0 до 1)
  const confidence = Math.min(1, Math.max(0.5, 0.5 + maxScore * 0.1));
  
  return {
    tone: dominantEmotion,
    score: intensity,
    confidence,
    keywords: foundKeywords.length > 0 ? foundKeywords : []
  };
}

/**
 * Генерирует промпт на основе эмоции
 * @param emotion Эмоция
 * @returns Промпт для пользователя
 */
function generatePromptFromEmotion(emotion: Emotion): string {
  // Базовые промпты для разных эмоциональных состояний
  const promptsByTone: Record<string, string[]> = {
    positive: [
      "Продолжайте практиковать благодарность каждый день",
      "Поделитесь своим хорошим настроением с близкими",
      "Запишите три вещи, которые сделали вас счастливыми сегодня"
    ],
    negative: [
      "Попробуйте глубокое дыхание: вдох на 4 счета, выдох на 6",
      "Выйдите на короткую прогулку на свежем воздухе",
      "Напишите о своих чувствах, не осуждая себя"
    ],
    anxious: [
      "Практика 5-4-3-2-1: назовите 5 вещей, которые видите, 4 - которые чувствуете, и т.д.",
      "Сделайте 10 медленных глубоких вдохов, сосредоточившись только на дыхании",
      "Попробуйте прогрессивную мышечную релаксацию"
    ],
    sad: [
      "Будьте добры к себе, как если бы вы утешали друга",
      "Послушайте музыку, которая поднимает настроение",
      "Свяжитесь с близким человеком для поддержки"
    ],
    angry: [
      "Сделайте паузу и сосчитайте до 10 перед реакцией",
      "Запишите свои мысли без цензуры, затем уничтожьте бумагу",
      "Физическая активность поможет выпустить накопившуюся энергию"
    ],
    excited: [
      "Направьте свою энергию на творческий проект",
      "Запишите свои идеи и планы, пока вдохновение сильно",
      "Поделитесь своим энтузиазмом с единомышленниками"
    ],
    neutral: [
      "Практикуйте осознанность в повседневных действиях",
      "Попробуйте что-то новое сегодня, даже если это что-то маленькое",
      "Уделите время для размышлений о своих целях и ценностях"
    ]
  };
  
  // Выбираем случайный промпт для соответствующего тона
  const prompts = promptsByTone[emotion.tone] || promptsByTone.neutral;
  return prompts[Math.floor(Math.random() * prompts.length)];
}
