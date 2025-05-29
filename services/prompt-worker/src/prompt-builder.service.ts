/**
 * Сервис для генерации промптов на основе эмоционального состояния
 */
import { Emotion, EmotionSnapshot, EmotionTone } from '@gc/types';
import { config } from './config';
import { logger } from './logger';

export class PromptBuilderService {
  /**
   * Генерирует промпт для AI на основе эмоционального состояния пользователя
   * @param userId ID пользователя
   * @param message Текст сообщения пользователя
   * @param emotion Результат анализа эмоций
   * @param snapshot Снапшот эмоционального состояния пользователя
   */
  generatePrompt(
    userId: string,
    message: string,
    emotion: Emotion,
    snapshot?: EmotionSnapshot | null
  ): string {
    try {
      logger.debug(`Генерация промпта для пользователя ${userId}`);
      
      // Выбираем базовый шаблон на основе доминантной эмоции
      const baseTemplate = this.getTemplateForEmotion(emotion.tone);
      
      // Формируем контекст на основе снапшота эмоционального состояния
      const emotionalContext = this.buildEmotionalContext(snapshot);
      
      // Формируем персонализированный промпт
      const prompt = this.buildPersonalizedPrompt(
        baseTemplate,
        message,
        emotion,
        emotionalContext
      );
      
      logger.debug(`Промпт успешно сгенерирован для пользователя ${userId}`);
      return prompt;
    } catch (error) {
      logger.error(`Ошибка при генерации промпта: ${error instanceof Error ? error.message : String(error)}`);
      // В случае ошибки возвращаем базовый шаблон
      return config.prompts.templates.neutral;
    }
  }

  /**
   * Получает шаблон промпта на основе эмоционального тона
   * @param tone Эмоциональный тон
   */
  private getTemplateForEmotion(tone: EmotionTone): string {
    switch (tone) {
      case 'positive':
        return config.prompts.templates.positive;
      case 'negative':
        return config.prompts.templates.negative;
      case 'anxious':
        return config.prompts.templates.anxious;
      case 'sad':
        return config.prompts.templates.sad;
      case 'angry':
        return config.prompts.templates.angry;
      case 'neutral':
      default:
        return config.prompts.templates.neutral;
    }
  }

  /**
   * Формирует контекст на основе снапшота эмоционального состояния
   * @param snapshot Снапшот эмоционального состояния
   */
  private buildEmotionalContext(snapshot?: EmotionSnapshot | null): string {
    if (!snapshot) {
      return 'Это первое сообщение пользователя, эмоциональный контекст отсутствует.';
    }

    // Анализируем историю эмоций
    const dominantEmotion = snapshot.dominantEmotion;
    const messageCount = snapshot.messageCount;
    
    // Формируем контекст на основе доминантной эмоции и количества сообщений
    let context = `На основе ${messageCount} сообщений, пользователь преимущественно испытывает `;
    
    switch (dominantEmotion.tone) {
      case 'positive':
        context += 'позитивные эмоции. ';
        break;
      case 'negative':
        context += 'негативные эмоции. ';
        break;
      case 'anxious':
        context += 'тревожность. ';
        break;
      case 'sad':
        context += 'грусть. ';
        break;
      case 'angry':
        context += 'гнев. ';
        break;
      case 'neutral':
      default:
        context += 'нейтральные эмоции. ';
        break;
    }
    
    // Добавляем информацию о ключевых словах
    if (dominantEmotion.keywords && dominantEmotion.keywords.length > 0) {
      context += `Ключевые слова: ${dominantEmotion.keywords.join(', ')}.`;
    }
    
    return context;
  }

  /**
   * Формирует персонализированный промпт на основе шаблона, сообщения и эмоционального контекста
   * @param template Базовый шаблон
   * @param message Сообщение пользователя
   * @param emotion Результат анализа эмоций
   * @param emotionalContext Эмоциональный контекст
   */
  private buildPersonalizedPrompt(
    template: string,
    message: string,
    emotion: Emotion,
    emotionalContext: string
  ): string {
    // Формируем системный промпт для AI
    const systemPrompt = `
Ты - чуткий и эмпатичный ассистент для медитации в приложении Garden Calm.
Твоя задача - помогать пользователям справляться с их эмоциями и предлагать подходящие медитации.

ЭМОЦИОНАЛЬНЫЙ КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
${emotionalContext}

ТЕКУЩЕЕ ЭМОЦИОНАЛЬНОЕ СОСТОЯНИЕ:
Тон: ${emotion.tone}
Уверенность: ${emotion.confidence}
Ключевые слова: ${emotion.keywords ? emotion.keywords.join(', ') : 'отсутствуют'}

СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ:
"${message}"

ИНСТРУКЦИИ:
${template}

Твой ответ должен быть эмпатичным, поддерживающим и предлагать конкретные медитации.
Ограничь ответ 2-3 абзацами. Не используй эмодзи или специальное форматирование.
    `;
    
    // Обрезаем промпт до максимальной длины
    return systemPrompt.slice(0, config.prompts.maxLength);
  }
}
