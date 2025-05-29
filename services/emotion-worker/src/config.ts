/**
 * Конфигурация для RabbitMQ и Redis
 */
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

export const config = {
  // Настройки RabbitMQ
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE || 'garden_calm',
    emotionQueue: process.env.RABBITMQ_EMOTION_QUEUE || 'emotion_analysis',
    resultQueue: process.env.RABBITMQ_RESULT_QUEUE || 'emotion_results',
    prefetch: parseInt(process.env.RABBITMQ_PREFETCH || '10', 10),
  },
  
  // Настройки Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    prefix: process.env.REDIS_PREFIX || 'gc:emotion:',
    ttl: parseInt(process.env.REDIS_TTL || '86400', 10), // 24 часа по умолчанию
  },
  
  // Общие настройки
  worker: {
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
    retryAttempts: parseInt(process.env.WORKER_RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.WORKER_RETRY_DELAY || '1000', 10),
  }
};
