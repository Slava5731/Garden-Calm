/**
 * Основной файл воркера для генерации промптов
 */
import { PromptBuilderService } from './prompt-builder.service';
import { logger } from './logger';

// Создаем экземпляр сервиса генерации промптов
const promptBuilderService = new PromptBuilderService();

// Обработчик завершения работы
async function shutdown() {
  logger.info('Получен сигнал завершения работы');
  
  try {
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
    logger.info('Запуск воркера генерации промптов');
    
    // TODO: Реализовать подключение к RabbitMQ и Redis
    // TODO: Настроить обработку сообщений из очереди
    
    logger.info('Воркер генерации промптов успешно запущен');
  } catch (error) {
    logger.error(`Ошибка при запуске воркера: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Экспортируем сервис для использования в тестах
export { promptBuilderService };

// Запускаем воркер только если файл запущен напрямую
if (require.main === module) {
  start();
}
