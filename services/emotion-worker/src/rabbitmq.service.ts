/**
 * Сервис для работы с RabbitMQ
 */
import amqplib, { Channel, Connection } from 'amqplib';
import { config } from './config';
import { logger } from './logger';

export class RabbitMQService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  /**
   * Подключение к RabbitMQ
   */
  async connect(): Promise<void> {
    try {
      logger.info(`Подключение к RabbitMQ: ${config.rabbitmq.url}`);
      this.connection = await amqplib.connect(config.rabbitmq.url);
      this.channel = await this.connection.createChannel();
      
      // Устанавливаем prefetch для контроля нагрузки
      await this.channel.prefetch(config.rabbitmq.prefetch);
      
      // Настраиваем обработку ошибок и переподключение
      this.connection.on('error', (err) => {
        logger.error(`Ошибка соединения с RabbitMQ: ${err.message}`);
        this.reconnect();
      });
      
      this.connection.on('close', () => {
        logger.warn('Соединение с RabbitMQ закрыто, переподключение...');
        this.reconnect();
      });
      
      logger.info('Успешное подключение к RabbitMQ');
    } catch (error) {
      logger.error(`Ошибка при подключении к RabbitMQ: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Переподключение к RabbitMQ при обрыве соединения
   */
  private async reconnect(): Promise<void> {
    try {
      // Ждем некоторое время перед переподключением
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.connect();
    } catch (error) {
      logger.error(`Ошибка при переподключении к RabbitMQ: ${error instanceof Error ? error.message : String(error)}`);
      // Повторяем попытку переподключения
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  /**
   * Настройка обмена и очередей
   */
  async setup(): Promise<void> {
    if (!this.channel) {
      throw new Error('Канал RabbitMQ не инициализирован');
    }

    try {
      // Создаем exchange типа direct
      await this.channel.assertExchange(config.rabbitmq.exchange, 'direct', { durable: true });
      
      // Создаем очередь для анализа эмоций
      await this.channel.assertQueue(config.rabbitmq.emotionQueue, { durable: true });
      
      // Создаем очередь для результатов анализа
      await this.channel.assertQueue(config.rabbitmq.resultQueue, { durable: true });
      
      // Привязываем очереди к exchange
      await this.channel.bindQueue(config.rabbitmq.emotionQueue, config.rabbitmq.exchange, 'emotion.analyze');
      await this.channel.bindQueue(config.rabbitmq.resultQueue, config.rabbitmq.exchange, 'emotion.result');
      
      logger.info('Настройка обмена и очередей RabbitMQ завершена');
    } catch (error) {
      logger.error(`Ошибка при настройке RabbitMQ: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Подписка на сообщения из очереди анализа эмоций
   * @param callback Функция обработки сообщений
   */
  async consumeEmotionQueue(callback: (message: any) => Promise<void>): Promise<void> {
    if (!this.channel) {
      throw new Error('Канал RabbitMQ не инициализирован');
    }

    try {
      await this.channel.consume(config.rabbitmq.emotionQueue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            logger.debug(`Получено сообщение: ${JSON.stringify(content)}`);
            
            // Обрабатываем сообщение
            await callback(content);
            
            // Подтверждаем обработку сообщения
            this.channel?.ack(msg);
          } catch (error) {
            logger.error(`Ошибка при обработке сообщения: ${error instanceof Error ? error.message : String(error)}`);
            // Отклоняем сообщение и возвращаем его в очередь для повторной обработки
            this.channel?.nack(msg, false, true);
          }
        }
      });
      
      logger.info(`Начато прослушивание очереди: ${config.rabbitmq.emotionQueue}`);
    } catch (error) {
      logger.error(`Ошибка при подписке на очередь: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Отправка результата анализа эмоций в очередь результатов
   * @param result Результат анализа
   */
  async publishResult(result: any): Promise<void> {
    if (!this.channel) {
      throw new Error('Канал RabbitMQ не инициализирован');
    }

    try {
      const message = Buffer.from(JSON.stringify(result));
      this.channel.publish(config.rabbitmq.exchange, 'emotion.result', message, {
        persistent: true,
        contentType: 'application/json'
      });
      
      logger.debug(`Результат отправлен: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`Ошибка при публикации результата: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Закрытие соединения с RabbitMQ
   */
  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      
      if (this.connection) {
        await this.connection.close();
      }
      
      logger.info('Соединение с RabbitMQ закрыто');
    } catch (error) {
      logger.error(`Ошибка при закрытии соединения с RabbitMQ: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }
}
