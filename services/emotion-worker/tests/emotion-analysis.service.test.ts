/**
 * Тесты для сервиса анализа эмоций
 */
import { EmotionAnalysisService } from '../src/emotion-analysis.service';
import { RedisService } from '../src/redis.service';
import { RabbitMQService } from '../src/rabbitmq.service';
import { EmotionAnalyzer, EmotionSnapshotManager } from '@gc/domain';

// Мокаем зависимости
jest.mock('../src/redis.service');
jest.mock('../src/rabbitmq.service');
jest.mock('@gc/domain');

describe('EmotionAnalysisService', () => {
  let emotionService: EmotionAnalysisService;
  let mockRedisService: jest.Mocked<RedisService>;
  let mockRabbitService: jest.Mocked<RabbitMQService>;
  let mockEmotionAnalyzer: jest.Mocked<EmotionAnalyzer>;
  let mockSnapshotManager: jest.Mocked<EmotionSnapshotManager>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Создаем моки для зависимостей
    mockRedisService = new RedisService() as jest.Mocked<RedisService>;
    mockRabbitService = new RabbitMQService() as jest.Mocked<RabbitMQService>;
    
    // Настраиваем моки для методов
    mockRedisService.getEmotionSnapshot = jest.fn().mockResolvedValue(null);
    mockRedisService.saveEmotionSnapshot = jest.fn().mockResolvedValue(undefined);
    mockRedisService.saveEmotionResult = jest.fn().mockResolvedValue(undefined);
    mockRabbitService.publishResult = jest.fn().mockResolvedValue(undefined);
    
    // Создаем экземпляр сервиса
    emotionService = new EmotionAnalysisService(mockRedisService, mockRabbitService);
    
    // Получаем доступ к мокам внутренних зависимостей
    mockEmotionAnalyzer = EmotionAnalyzer.prototype as unknown as jest.Mocked<EmotionAnalyzer>;
    mockSnapshotManager = EmotionSnapshotManager.prototype as unknown as jest.Mocked<EmotionSnapshotManager>;
    
    // Настраиваем моки для методов доменной логики
    mockEmotionAnalyzer.analyzeEmotion = jest.fn().mockReturnValue({
      tone: 'positive',
      score: 80,
      confidence: 0.9,
      keywords: ['happy']
    });
    
    mockSnapshotManager.createSnapshot = jest.fn().mockReturnValue({
      userId: 'test-user',
      emotions: [{
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['happy']
      }],
      dominantEmotion: {
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['happy']
      },
      messageCount: 1,
      lastUpdated: new Date()
    });
    
    mockSnapshotManager.updateSnapshot = jest.fn().mockReturnValue({
      userId: 'test-user',
      emotions: [{
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['happy']
      }],
      dominantEmotion: {
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['happy']
      },
      messageCount: 2,
      lastUpdated: new Date()
    });
  });

  test('должен обрабатывать валидное сообщение', async () => {
    const message = {
      id: 'msg-123',
      userId: 'test-user',
      content: 'Я чувствую себя счастливым!'
    };

    await emotionService.processMessage(message);
    
    // Проверяем, что анализ эмоций был вызван
    expect(mockEmotionAnalyzer.analyzeEmotion).toHaveBeenCalledWith(message.content);
    
    // Проверяем, что был запрос снапшота из Redis
    expect(mockRedisService.getEmotionSnapshot).toHaveBeenCalledWith(message.userId);
    
    // Проверяем, что был создан новый снапшот
    expect(mockSnapshotManager.createSnapshot).toHaveBeenCalledWith(message.userId, message.content);
    
    // Проверяем, что снапшот был сохранен в Redis
    expect(mockRedisService.saveEmotionSnapshot).toHaveBeenCalled();
    
    // Проверяем, что результат был сохранен в Redis
    expect(mockRedisService.saveEmotionResult).toHaveBeenCalledWith(message.id, expect.objectContaining({
      messageId: message.id,
      userId: message.userId
    }));
    
    // Проверяем, что результат был опубликован в RabbitMQ
    expect(mockRabbitService.publishResult).toHaveBeenCalled();
  });

  test('должен обновлять существующий снапшот', async () => {
    // Настраиваем мок для получения существующего снапшота
    mockRedisService.getEmotionSnapshot = jest.fn().mockResolvedValue({
      userId: 'test-user',
      emotions: [{
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['happy']
      }],
      dominantEmotion: {
        tone: 'positive',
        score: 80,
        confidence: 0.9,
        keywords: ['happy']
      },
      messageCount: 1,
      lastUpdated: new Date()
    });

    const message = {
      id: 'msg-123',
      userId: 'test-user',
      content: 'Я чувствую себя счастливым!'
    };

    await emotionService.processMessage(message);
    
    // Проверяем, что был запрос снапшота из Redis
    expect(mockRedisService.getEmotionSnapshot).toHaveBeenCalledWith(message.userId);
    
    // Проверяем, что был обновлен существующий снапшот
    expect(mockSnapshotManager.updateSnapshot).toHaveBeenCalled();
    expect(mockSnapshotManager.createSnapshot).not.toHaveBeenCalled();
    
    // Проверяем, что снапшот был сохранен в Redis
    expect(mockRedisService.saveEmotionSnapshot).toHaveBeenCalled();
  });

  test('должен игнорировать невалидное сообщение', async () => {
    const invalidMessage = {
      // Отсутствует id
      userId: 'test-user',
      content: 'Невалидное сообщение'
    };

    await emotionService.processMessage(invalidMessage);
    
    // Проверяем, что анализ эмоций не был вызван
    expect(mockEmotionAnalyzer.analyzeEmotion).not.toHaveBeenCalled();
    
    // Проверяем, что не было запроса снапшота из Redis
    expect(mockRedisService.getEmotionSnapshot).not.toHaveBeenCalled();
    
    // Проверяем, что снапшот не был сохранен в Redis
    expect(mockRedisService.saveEmotionSnapshot).not.toHaveBeenCalled();
    
    // Проверяем, что результат не был опубликован в RabbitMQ
    expect(mockRabbitService.publishResult).not.toHaveBeenCalled();
  });
});
