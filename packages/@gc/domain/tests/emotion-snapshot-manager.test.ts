import { EmotionSnapshotManager } from '../src/emotion-snapshot-manager';
import { EmotionAnalyzer } from '../src/emotion-analyzer';
import { Emotion } from '@gc/types';

// Мок для EmotionAnalyzer
jest.mock('../src/emotion-analyzer');
const MockedEmotionAnalyzer = EmotionAnalyzer as jest.MockedClass<typeof EmotionAnalyzer>;

describe('EmotionSnapshotManager', () => {
  let snapshotManager: EmotionSnapshotManager;
  let mockAnalyzer: EmotionAnalyzer;

  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
    
    // Создаем мок для анализатора эмоций
    mockAnalyzer = new EmotionAnalyzer();
    
    // Настраиваем мок для метода analyzeEmotion
    (mockAnalyzer.analyzeEmotion as jest.Mock).mockImplementation((message: string): Emotion => {
      if (message.includes('счастлив')) {
        return {
          tone: 'positive',
          score: 85,
          confidence: 0.8,
          keywords: ['счастлив']
        };
      } else if (message.includes('тревог')) {
        return {
          tone: 'anxious',
          score: 65,
          confidence: 0.75,
          keywords: ['тревог']
        };
      } else {
        return {
          tone: 'neutral',
          score: 50,
          confidence: 0.9,
          keywords: []
        };
      }
    });
    
    // Создаем менеджер снапшотов с моком анализатора
    snapshotManager = new EmotionSnapshotManager(mockAnalyzer);
  });

  test('должен создавать новый снапшот для нового пользователя', () => {
    const userId = 'user-123';
    const message = 'Я чувствую себя счастливым сегодня!';
    
    const snapshot = snapshotManager.createSnapshot(userId, message);
    
    expect(snapshot).toBeDefined();
    expect(snapshot.userId).toBe(userId);
    expect(snapshot.emotions.length).toBe(1);
    expect(snapshot.dominantEmotion.tone).toBe('positive');
    expect(snapshot.messageCount).toBe(1);
  });

  test('должен обновлять существующий снапшот для известного пользователя', () => {
    const userId = 'user-123';
    
    // Создаем первый снапшот
    const firstMessage = 'Я чувствую себя счастливым сегодня!';
    const firstSnapshot = snapshotManager.createSnapshot(userId, firstMessage);
    
    // Создаем второй снапшот для того же пользователя
    const secondMessage = 'Но я немного тревожусь о завтрашнем дне';
    const secondSnapshot = snapshotManager.createSnapshot(userId, secondMessage);
    
    expect(secondSnapshot).toBeDefined();
    expect(secondSnapshot.userId).toBe(userId);
    expect(secondSnapshot.emotions.length).toBe(2);
    expect(secondSnapshot.messageCount).toBe(2);
    
    // Проверяем, что доминирующая эмоция рассчитана корректно
    // В данном случае у нас одна позитивная и одна тревожная эмоция,
    // поэтому доминирующая эмоция может быть любой из них
    expect(['positive', 'anxious']).toContain(secondSnapshot.dominantEmotion.tone);
  });

  test('должен корректно получать снапшот пользователя', () => {
    const userId = 'user-123';
    const message = 'Я чувствую себя счастливым сегодня!';
    
    // Создаем снапшот
    snapshotManager.createSnapshot(userId, message);
    
    // Получаем снапшот
    const snapshot = snapshotManager.getSnapshot(userId);
    
    expect(snapshot).toBeDefined();
    expect(snapshot?.userId).toBe(userId);
  });

  test('должен возвращать undefined для несуществующего пользователя', () => {
    const snapshot = snapshotManager.getSnapshot('non-existent-user');
    
    expect(snapshot).toBeUndefined();
  });
});
