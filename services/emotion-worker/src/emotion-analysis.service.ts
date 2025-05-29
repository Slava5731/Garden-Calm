/**
 * Сервис для анализа эмоций
 */
import { EmotionAnalyzer, EmotionSnapshotManager } from '@gc/domain';
import { Message, Emotion, EmotionSnapshot } from '@gc/types';
import { logger } from './logger';
import { RedisService } from './redis.service';
import { RabbitMQService } from './rabbitmq.service';

export class EmotionAnalysisService {
  private emotionAnalyzer: EmotionAnalyzer;
  private snapshotManager: EmotionSnapshotManager;
  private redisService: RedisService;
  private rabbitService: RabbitMQService;

  constructor(redisService: RedisService, rabbitService: RabbitMQService) {
    this.emotionAnalyzer = new EmotionAnalyzer();
    this.snapshotManager = new EmotionSnapshotManager(this.emotionAnalyzer);
    this.redisService = redisService;
    this.rabbitService = rabbitService;
  }

  /**
   * Обработка сообщения из очереди
   * @param message Сообщение для анализа
   */
  async processMessage(message: any): Promise<void> {
    try {
      logger.info(`Обработка сообщения: ${message.id}`);

      // Проверяем валидность сообщения
      if (!this.isValidMessage(message)) {
        logger.error(`Невалидное сообщение: ${JSON.stringify(message)}`);
        return;
      }

      // Анализируем эмоции в сообщении
      const emotion = this.emotionAnalyzer.analyzeEmotion(message.content);
      logger.debug(`Результат анализа эмоций: ${JSON.stringify(emotion)}`);

      // Получаем текущий снапшот пользователя из Redis
      let snapshot = await this.redisService.getEmotionSnapshot(message.userId);

      // Если снапшот не найден, создаем новый
      if (!snapshot) {
        snapshot = this.snapshotManager.createSnapshot(message.userId, message.content);
      } else {
        // Обновляем существующий снапшот
        snapshot = this.snapshotManager.updateSnapshot(snapshot, message.content);
      }

      // Сохраняем обновленный снапшот в Redis
      await this.redisService.saveEmotionSnapshot(message.userId, snapshot);

      // Создаем результат анализа
      const result = {
        messageId: message.id,
        userId: message.userId,
        emotion: emotion,
        snapshot: {
          dominantEmotion: snapshot.dominantEmotion,
          messageCount: snapshot.messageCount,
          lastUpdated: snapshot.lastUpdated
        },
        timestamp: new Date()
      };

      // Сохраняем результат в Redis
      await this.redisService.saveEmotionResult(message.id, result);

      // Публикуем результат в очередь результатов
      await this.rabbitService.publishResult(result);

      logger.info(`Сообщение ${message.id} успешно обработано`);
    } catch (error) {
      logger.error(`Ошибка при обработке сообщения: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Проверка валидности сообщения
   * @param message Сообщение для проверки
   */
  private isValidMessage(message: any): boolean {
    return (
      message &&
      typeof message.id === 'string' &&
      typeof message.userId === 'string' &&
      typeof message.content === 'string'
    );
  }
}
