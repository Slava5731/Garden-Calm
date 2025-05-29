/**
 * Интеграционный тест для проверки взаимодействия emotion-worker с web-приложением
 */
import { RabbitMQService } from '../src/rabbitmq.service';
import { RedisService } from '../src/redis.service';
import { EmotionAnalysisService } from '../src/emotion-analysis.service';
import { Message } from '@gc/types';

// Мокаем внешние зависимости
jest.mock('../src/rabbitmq.service');
jest.mock('../src/redis.service');

describe('Интеграция emotion-worker с web-приложением', () => {
  let rabbitService: jest.Mocked<RabbitMQService>;
  let redisService: jest.Mocked<RedisService>;
  let emotionService: EmotionAnalysisService;
  
  // Тестовое сообщение от пользователя
  const testMessage: Message = {
    id: 'test-message-id',
    userId: 'test-user-id',
    content: 'Я чувствую себя счастливым и спокойным сегодня',
    role: 'user',
    timestamp: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Создаем моки сервисов
    rabbitService = new RabbitMQService() as jest.Mocked<RabbitMQService>;
    redisService = new RedisService() as jest.Mocked<RedisService>;
    
    // Настраиваем поведение моков
    rabbitService.connect = jest.fn().mockResolvedValue(undefined);
    rabbitService.setup = jest.fn().mockResolvedValue(undefined);
    rabbitService.publishResult = jest.fn().mockResolvedValue(undefined);
    
    redisService.getEmotionSnapshot = jest.fn().mockResolvedValue(null);
    redisService.saveEmotionSnapshot = jest.fn().mockResolvedValue(undefined);
    redisService.saveEmotionResult = jest.fn().mockResolvedValue(undefined);
    
    // Создаем экземпляр сервиса анализа эмоций
    emotionService = new EmotionAnalysisService(redisService, rabbitService);
  });

  test('должен обрабатывать сообщение из web-приложения и сохранять результаты', async () => {
    // Имитируем получение сообщения из очереди (как если бы оно пришло из web-приложения)
    await emotionService.processMessage(testMessage);
    
    // Проверяем, что был запрос снапшота из Redis
    expect(redisService.getEmotionSnapshot).toHaveBeenCalledWith(testMessage.userId);
    
    // Проверяем, что снапшот был сохранен в Redis
    expect(redisService.saveEmotionSnapshot).toHaveBeenCalled();
    
    // Проверяем, что результат анализа был сохранен в Redis
    expect(redisService.saveEmotionResult).toHaveBeenCalledWith(
      testMessage.id,
      expect.objectContaining({
        messageId: testMessage.id,
        userId: testMessage.userId,
        emotion: expect.any(Object)
      })
    );
    
    // Проверяем, что результат был опубликован в очередь результатов
    expect(rabbitService.publishResult).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: testMessage.id,
        userId: testMessage.userId,
        emotion: expect.any(Object)
      })
    );
  });

  test('должен корректно обрабатывать последовательность сообщений от одного пользователя', async () => {
    // Первое сообщение от пользователя
    await emotionService.processMessage(testMessage);
    
    // Имитируем наличие снапшота в Redis после обработки первого сообщения
    const mockSnapshot = {
      userId: testMessage.userId,
      emotions: [{
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['счастливый', 'спокойный']
      }],
      dominantEmotion: {
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['счастливый', 'спокойный']
      },
      messageCount: 1,
      lastUpdated: new Date()
    };
    
    redisService.getEmotionSnapshot = jest.fn().mockResolvedValue(mockSnapshot);
    
    // Второе сообщение от того же пользователя
    const secondMessage: Message = {
      id: 'test-message-id-2',
      userId: testMessage.userId,
      content: 'Но я немного беспокоюсь о завтрашнем дне',
      role: 'user',
      timestamp: new Date()
    };
    
    await emotionService.processMessage(secondMessage);
    
    // Проверяем, что был запрос существующего снапшота из Redis
    expect(redisService.getEmotionSnapshot).toHaveBeenCalledWith(secondMessage.userId);
    
    // Проверяем, что обновленный снапшот был сохранен в Redis
    expect(redisService.saveEmotionSnapshot).toHaveBeenCalled();
    
    // Проверяем, что результат анализа второго сообщения был сохранен в Redis
    expect(redisService.saveEmotionResult).toHaveBeenCalledWith(
      secondMessage.id,
      expect.objectContaining({
        messageId: secondMessage.id,
        userId: secondMessage.userId
      })
    );
    
    // Проверяем, что результат был опубликован в очередь результатов
    expect(rabbitService.publishResult).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: secondMessage.id,
        userId: secondMessage.userId
      })
    );
  });
});
