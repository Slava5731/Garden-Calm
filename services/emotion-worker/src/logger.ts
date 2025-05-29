/**
 * Логгер для emotion-worker
 */
import winston from 'winston';

// Создаем форматтер для логов
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Настраиваем логгер
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/emotion-worker-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/emotion-worker.log' })
  ]
});

// Добавляем обработку неперехваченных исключений
process.on('uncaughtException', (error) => {
  logger.error(`Неперехваченное исключение: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Необработанное отклонение промиса: ${reason instanceof Error ? reason.message : String(reason)}`);
});
