/**
 * Интеграция Claude Haiku для Garden Calm
 * 
 * Генерация ответов на основе эмоционального состояния пользователя.
 * Локальная реализация с моками для разработки без внешних API.
 */

import { EmotionSnapshot } from '@gc/types';
import { Message } from '@gc/types';

/**
 * Интерфейс для конфигурации Haiku
 */
interface HaikuConfig {
  /**
   * API ключ для Anthropic API
   */
  apiKey: string;
  
  /**
   * Базовый URL для API
   */
  baseUrl?: string;
  
  /**
   * Максимальное количество токенов в ответе
   */
  maxTokens?: number;
  
  /**
   * Температура для генерации (0.0 - 1.0)
   */
  temperature?: number;
}

/**
 * Класс для работы с Claude Haiku
 */
export class HaikuClient {
  private config: HaikuConfig;
  private useMock: boolean;
  
  /**
   * Создает экземпляр клиента Haiku
   * @param config Конфигурация клиента
   * @param useMock Использовать ли мок-реализацию (по умолчанию true для локальной разработки)
   */
  constructor(config: HaikuConfig, useMock: boolean = true) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://api.anthropic.com/v1/messages',
      maxTokens: config.maxTokens || 300,
      temperature: config.temperature || 0.7
    };
    
    this.useMock = useMock;
    
    console.log(`HaikuClient initialized with ${useMock ? 'mock' : 'real'} implementation`);
  }
  
  /**
   * Генерирует ответ на основе сообщений и эмоционального снапшота
   * @param messages История сообщений
   * @param snapshot Эмоциональный снапшот пользователя
   * @returns Сгенерированный ответ
   */
  async generateResponse(messages: Message[], snapshot: EmotionSnapshot): Promise<string> {
    if (this.useMock) {
      return this.mockGenerateResponse(messages, snapshot);
    }
    
    // В реальной реализации здесь был бы код для вызова Anthropic API
    throw new Error('Real API implementation not available in local development');
  }
  
  /**
   * Мок-реализация генерации ответа
   * @param messages История сообщений
   * @param snapshot Эмоциональный снапшот пользователя
   * @returns Сгенерированный ответ
   */
  private async mockGenerateResponse(messages: Message[], snapshot: EmotionSnapshot): Promise<string> {
    // Получаем последнее сообщение пользователя
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    
    // Определяем тон ответа на основе эмоционального снапшота
    const tone = snapshot.dominantEmotion.tone;
    
    // Базовые ответы для разных эмоциональных состояний
    const responsesByTone: Record<string, string[]> = {
      positive: [
        "Я рад, что у вас хорошее настроение! Это прекрасное время для творчества и новых идей.",
        "Приятно видеть ваш позитивный настрой. Как вы планируете использовать эту энергию сегодня?",
        "Ваше хорошее настроение заразительно! Это отличный момент для практики благодарности."
      ],
      negative: [
        "Я вижу, что сейчас вам непросто. Помните, что все эмоции временны и это нормально иногда чувствовать себя не лучшим образом.",
        "Когда мы проходим через трудные моменты, важно быть добрее к себе. Может быть, сейчас хорошее время для небольшой паузы?",
        "Я здесь, чтобы выслушать вас. Иногда просто выражение чувств может принести облегчение."
      ],
      anxious: [
        "Я замечаю некоторое беспокойство в ваших словах. Давайте сделаем глубокий вдох вместе? Вдох на 4 счета, задержка на 7, выдох на 8.",
        "Тревога может быть очень неприятной. Попробуйте сосредоточиться на том, что вы можете контролировать прямо сейчас.",
        "Когда мы чувствуем тревогу, наш ум часто уносится в будущее. Попробуйте заметить 5 вещей, которые вы видите прямо сейчас."
      ],
      sad: [
        "Я чувствую грусть в ваших словах. Помните, что грусть — это нормальная часть человеческого опыта, и она тоже пройдет.",
        "В моменты грусти важно быть особенно бережным к себе. Может быть, сейчас хорошее время для чего-то успокаивающего?",
        "Иногда грусть приходит волнами. Позвольте себе почувствовать эти эмоции, не осуждая себя за них."
      ],
      angry: [
        "Я вижу, что вы испытываете сильные эмоции. Гнев часто сигнализирует о том, что что-то важное для вас находится под угрозой.",
        "Когда мы злимся, наше тело наполняется энергией. Может быть полезно направить эту энергию в физическую активность.",
        "Гнев — это нормальная эмоция, но важно выражать его здоровым образом. Может быть, запись мыслей поможет прояснить ситуацию?"
      ],
      excited: [
        "Ваш энтузиазм заразителен! Это прекрасное время для творчества и новых начинаний.",
        "Я рад видеть ваше воодушевление! Как вы планируете направить эту энергию?",
        "Ваше возбуждение создает отличный момент для постановки целей и мечтаний о будущем."
      ],
      neutral: [
        "Как вы себя чувствуете сегодня? Иногда полезно просто остановиться и прислушаться к своим ощущениям.",
        "Спокойное состояние ума — отличная возможность для практики осознанности и размышлений.",
        "В нейтральном состоянии мы можем лучше наблюдать за своими мыслями. Есть ли что-то, на чем вы хотели бы сосредоточиться сегодня?"
      ]
    };
    
    // Выбираем случайный ответ для соответствующего тона
    const responses = responsesByTone[tone] || responsesByTone.neutral;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Добавляем персонализированный элемент на основе последнего сообщения
    let personalizedResponse = '';
    
    if (lastUserMessage.length > 0) {
      // Простая персонализация на основе ключевых слов
      if (lastUserMessage.toLowerCase().includes('медитац')) {
        personalizedResponse = "\n\nМедитация может быть отличным способом поддержать ваше эмоциональное благополучие. Хотите попробовать короткую практику осознанности?";
      } else if (lastUserMessage.toLowerCase().includes('сон') || lastUserMessage.toLowerCase().includes('спать')) {
        personalizedResponse = "\n\nКачественный сон очень важен для эмоционального баланса. Регулярный режим сна и расслабляющие ритуалы перед сном могут значительно улучшить ваше самочувствие.";
      } else if (lastUserMessage.toLowerCase().includes('стресс')) {
        personalizedResponse = "\n\nСтресс — это естественная реакция организма, но важно находить здоровые способы его регулирования. Глубокое дыхание, прогулки на природе и медитация могут помочь снизить уровень стресса.";
      }
    }
    
    // Добавляем рекомендацию из снапшота, если она есть
    let recommendationResponse = '';
    if (snapshot.prompt) {
      recommendationResponse = `\n\nВозможно, сейчас будет полезно: ${snapshot.prompt}`;
    }
    
    // Формируем полный ответ
    return `${randomResponse}${personalizedResponse}${recommendationResponse}`;
  }
}

/**
 * Генерирует промпт для Haiku на основе сообщений и снапшота
 * @param messages История сообщений
 * @param snapshot Эмоциональный снапшот пользователя
 * @returns Промпт для Haiku
 */
export function createHaikuPrompt(messages: Message[], snapshot: EmotionSnapshot): string {
  // Базовая инструкция для модели
  const baseInstruction = `Ты эмпатичный и поддерживающий ассистент для медитации и осознанности Garden Calm. 
Твоя цель — помочь пользователю улучшить эмоциональное состояние через осознанность и медитативные практики.

Текущее эмоциональное состояние пользователя:
- Доминирующая эмоция: ${snapshot.dominantEmotion.tone}
- Интенсивность: ${snapshot.dominantEmotion.score}/100
- Ключевые слова: ${snapshot.dominantEmotion.keywords.join(', ')}

Твой ответ должен быть:
1. Эмпатичным и поддерживающим
2. Кратким (не более 2-3 предложений)
3. Соответствующим эмоциональному состоянию пользователя
4. Содержать одну конкретную рекомендацию или практику
5. Избегать клише и общих фраз

Не упоминай напрямую, что ты знаешь эмоциональное состояние пользователя или что у тебя есть эта информация.`; // Форматируем историю сообщений
  const formattedMessages = messages.map(msg => {
    return `${msg.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${msg.content}`;
  }).join('\n\n');
  
  // Собираем полный промпт
  return `${baseInstruction}\n\nИстория диалога:\n${formattedMessages}\n\nТвой ответ:`;
}

/**
 * Экспортируем клиент Haiku для использования в приложении
 */
export const haikuClient = new HaikuClient({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-mock-key-for-local-development',
  maxTokens: 300,
  temperature: 0.7
}, true); // Всегда используем мок в локальной разработке
