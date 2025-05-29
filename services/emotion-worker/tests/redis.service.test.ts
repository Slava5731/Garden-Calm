/**
 * Тесты для Redis сервиса
 */
import { RedisService } from '../src/redis.service';
import Redis from 'ioredis';
import { EmotionSnapshot, EmotionTone } from '@gc/types';

// Мокаем модуль ioredis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn().mockImplementation((key) => {
        if (key.includes('non-existent')) {
          return Promise.resolve(null);
        }
        return Promise.resolve(JSON.stringify({
          userId: 'test-user',
          emotions: [{ tone: 'positive' as EmotionTone, score: 80, confidence: 0.9, keywords: ['happy'] }],
          dominantEmotion: { tone: 'positive' as EmotionTone, score: 80, confidence: 0.9, keywords: ['happy'] },
          messageCount: 1,
          lastUpdated: new Date().toISOString()
        }));
      }),
      quit: jest.fn().mockResolvedValue('OK')
    };
  });
});

describe('RedisService', () => {
  let redisService: RedisService;
  let mockRedisClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    redisService = new RedisService();
    mockRedisClient = (Redis as unknown as jest.Mock).mock.results[0].value;
  });

  test('должен создавать экземпляр Redis клиента', () => {
    expect(Redis).toHaveBeenCalled();
    expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockRedisClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
  });

  test('должен сохранять снапшот эмоций', async () => {
    const userId = 'test-user';
    const snapshot: EmotionSnapshot = {
      userId,
      emotions: [{ tone: 'positive', score: 80, confidence: 0.9, keywords: ['happy'] }],
      dominantEmotion: { tone: 'positive', score: 80, confidence: 0.9, keywords: ['happy'] },
      messageCount: 1,
      lastUpdated: new Date()
    };

    await redisService.saveEmotionSnapshot(userId, snapshot);
    
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      expect.stringContaining(userId),
      expect.any(String),
      'EX',
      expect.any(Number)
    );
  });

  test('должен получать снапшот эмоций', async () => {
    const userId = 'test-user';
    const snapshot = await redisService.getEmotionSnapshot(userId);
    
    expect(mockRedisClient.get).toHaveBeenCalledWith(expect.stringContaining(userId));
    expect(snapshot).toBeDefined();
    expect(snapshot?.userId).toBe(userId);
  });

  test('должен возвращать null для несуществующего снапшота', async () => {
    const userId = 'non-existent-user';
    const snapshot = await redisService.getEmotionSnapshot(userId);
    
    expect(mockRedisClient.get).toHaveBeenCalledWith(expect.stringContaining(userId));
    expect(snapshot).toBeNull();
  });

  test('должен сохранять результат анализа эмоций', async () => {
    const messageId = 'test-message';
    const result = { emotion: 'positive', score: 80 };

    await redisService.saveEmotionResult(messageId, result);
    
    expect(mockRedisClient.set).toHaveBeenCalledWith(
      expect.stringContaining(messageId),
      expect.any(String),
      'EX',
      expect.any(Number)
    );
  });

  test('должен получать результат анализа эмоций', async () => {
    const messageId = 'test-message';
    const result = await redisService.getEmotionResult(messageId);
    
    expect(mockRedisClient.get).toHaveBeenCalledWith(expect.stringContaining(messageId));
    expect(result).toBeDefined();
  });

  test('должен корректно закрывать соединение', async () => {
    await redisService.close();
    
    expect(mockRedisClient.quit).toHaveBeenCalled();
  });
});
