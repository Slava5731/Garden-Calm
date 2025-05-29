/**
 * Сервис для работы с Redis
 */
import Redis from 'ioredis';
import { config } from './config';
import { logger } from './logger';
import { EmotionSnapshot } from '@gc/types';

export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis.url);
    
    // Настраиваем обработку ошибок
    this.client.on('error', (err) => {
      logger.error(`Ошибка Redis: ${err.message}`);
    });
    
    this.client.on('connect', () => {
      logger.info(`Подключение к Redis установлено: ${config.redis.url}`);
    });
  }

  /**
   * Сохранение снапшота эмоций пользователя
   * @param userId ID пользователя
   * @param snapshot Снапшот эмоций
   */
  async saveEmotionSnapshot(userId: string, snapshot: EmotionSnapshot): Promise<void> {
    try {
      const key = `${config.redis.prefix}snapshot:${userId}`;
      await this.client.set(key, JSON.stringify(snapshot), 'EX', config.redis.ttl);
      logger.debug(`Снапшот эмоций сохранен для пользователя ${userId}`);
    } catch (error) {
      logger.error(`Ошибка при сохранении снапшота эмоций: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Получение снапшота эмоций пользователя
   * @param userId ID пользователя
   */
  async getEmotionSnapshot(userId: string): Promise<EmotionSnapshot | null> {
    try {
      const key = `${config.redis.prefix}snapshot:${userId}`;
      const data = await this.client.get(key);
      
      if (!data) {
        logger.debug(`Снапшот эмоций не найден для пользователя ${userId}`);
        return null;
      }
      
      return JSON.parse(data) as EmotionSnapshot;
    } catch (error) {
      logger.error(`Ошибка при получении снапшота эмоций: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Сохранение результата анализа эмоций
   * @param messageId ID сообщения
   * @param result Результат анализа
   */
  async saveEmotionResult(messageId: string, result: any): Promise<void> {
    try {
      const key = `${config.redis.prefix}result:${messageId}`;
      await this.client.set(key, JSON.stringify(result), 'EX', config.redis.ttl);
      logger.debug(`Результат анализа эмоций сохранен для сообщения ${messageId}`);
    } catch (error) {
      logger.error(`Ошибка при сохранении результата анализа: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Получение результата анализа эмоций
   * @param messageId ID сообщения
   */
  async getEmotionResult(messageId: string): Promise<any | null> {
    try {
      const key = `${config.redis.prefix}result:${messageId}`;
      const data = await this.client.get(key);
      
      if (!data) {
        logger.debug(`Результат анализа не найден для сообщения ${messageId}`);
        return null;
      }
      
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Ошибка при получении результата анализа: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Закрытие соединения с Redis
   */
  async close(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('Соединение с Redis закрыто');
    } catch (error) {
      logger.error(`Ошибка при закрытии соединения с Redis: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
