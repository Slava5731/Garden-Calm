/**
 * Основной файл воркера для анализа эмоций
 */
import { RabbitMQService } from './rabbitmq.service';
import { RedisService } from './redis.service';
import { EmotionAnalysisService } from './emotion-analysis.service';
import { logger } from './logger';

// Создаем экземпляры сервисов
const rabbitService = new RabbitMQService();
const redisService = new RedisService();
const emotionService = new EmotionAnalysisService(redisService, rabbitService);

// Обработчик завершения работы
async function shutdown() {
  logger.info('Получен сигнал завершения работы');
  
  try {
    await rabbitService.close();
    await redisService.close();
    logger.info('Воркер корректно завершил работу');
    process.exit(0);
  } catch (error) {
    logger.error(`Ошибка при завершении работы: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Обработчики сигналов завершения
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Запуск воркера
async function start() {
  try {
    logger.info('Запуск воркера анализа эмоций');
    
    // Подключаемся к RabbitMQ
    await rabbitService.connect();
    
    // Настраиваем обмен и очереди
    await rabbitService.setup();
    
    // Начинаем обработку сообщений из очереди
    await rabbitService.consumeEmotionQueue(async (message) => {
      await emotionService.processMessage(message);
    });
    
    logger.info('Воркер анализа эмоций успешно запущен');
  } catch (error) {
    logger.error(`Ошибка при запуске воркера: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Запускаем воркер
start();
