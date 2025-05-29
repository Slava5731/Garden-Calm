/**
 * Конфигурация для prompt-worker
 */
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

export const config = {
  // Настройки RabbitMQ
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE || 'garden_calm',
    promptQueue: process.env.RABBITMQ_PROMPT_QUEUE || 'prompt_generation',
    resultQueue: process.env.RABBITMQ_PROMPT_RESULT_QUEUE || 'prompt_results',
    prefetch: parseInt(process.env.RABBITMQ_PREFETCH || '10', 10),
  },
  
  // Настройки Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    prefix: process.env.REDIS_PREFIX || 'gc:prompt:',
    ttl: parseInt(process.env.REDIS_TTL || '86400', 10), // 24 часа по умолчанию
  },
  
  // Настройки промптов
  prompts: {
    // Базовые шаблоны для разных эмоциональных состояний
    templates: {
      positive: process.env.PROMPT_TEMPLATE_POSITIVE || 
        'Пользователь чувствует себя позитивно. Поддержи это настроение и предложи медитацию для усиления положительных эмоций.',
      negative: process.env.PROMPT_TEMPLATE_NEGATIVE || 
        'Пользователь испытывает негативные эмоции. Помоги ему справиться с этим состоянием и предложи успокаивающую медитацию.',
      neutral: process.env.PROMPT_TEMPLATE_NEUTRAL || 
        'Пользователь в нейтральном эмоциональном состоянии. Предложи медитацию для повышения осознанности и внимательности.',
      anxious: process.env.PROMPT_TEMPLATE_ANXIOUS || 
        'Пользователь испытывает тревогу. Помоги ему успокоиться и предложи медитацию для снижения тревожности.',
      sad: process.env.PROMPT_TEMPLATE_SAD || 
        'Пользователь чувствует грусть. Поддержи его и предложи медитацию для улучшения эмоционального состояния.',
      angry: process.env.PROMPT_TEMPLATE_ANGRY || 
        'Пользователь испытывает гнев. Помоги ему справиться с этой эмоцией и предложи медитацию для обретения спокойствия.',
    },
    
    // Максимальная длина промпта
    maxLength: parseInt(process.env.PROMPT_MAX_LENGTH || '2000', 10),
    
    // Температура для генерации (влияет на креативность)
    temperature: parseFloat(process.env.PROMPT_TEMPERATURE || '0.7'),
  },
  
  // Общие настройки
  worker: {
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
    retryAttempts: parseInt(process.env.WORKER_RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.WORKER_RETRY_DELAY || '1000', 10),
  }
};
