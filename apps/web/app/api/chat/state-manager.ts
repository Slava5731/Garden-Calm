/**
 * State Manager для Garden Calm
 * 
 * Управляет эмоциональными снапшотами пользователей.
 * Локальная реализация с моками для разработки без Redis.
 */

import { EmotionSnapshot } from '@gc/types';

/**
 * Интерфейс для хранилища снапшотов
 */
interface SnapshotStorage {
  /**
   * Получить текущий снапшот пользователя
   */
  getCurrentSnapshot(userId: string): Promise<EmotionSnapshot | null>;
  
  /**
   * Обновить снапшот пользователя
   */
  updateSnapshot(userId: string, snapshot: EmotionSnapshot): Promise<void>;
  
  /**
   * Получить историю снапшотов пользователя
   */
  getSnapshotHistory(userId: string, limit?: number): Promise<EmotionSnapshot[]>;
}

/**
 * Мок-реализация хранилища снапшотов для локальной разработки
 */
class MockSnapshotStorage implements SnapshotStorage {
  // In-memory хранилище снапшотов
  private snapshots: Map<string, EmotionSnapshot[]> = new Map();
  
  /**
   * Получить текущий снапшот пользователя
   * @param userId ID пользователя
   * @returns Последний снапшот или null, если снапшотов нет
   */
  async getCurrentSnapshot(userId: string): Promise<EmotionSnapshot | null> {
    const userSnapshots = this.snapshots.get(userId) || [];
    return userSnapshots.length > 0 ? userSnapshots[userSnapshots.length - 1] : null;
  }
  
  /**
   * Обновить снапшот пользователя
   * @param userId ID пользователя
   * @param snapshot Новый снапшот
   */
  async updateSnapshot(userId: string, snapshot: EmotionSnapshot): Promise<void> {
    const userSnapshots = this.snapshots.get(userId) || [];
    
    // Добавляем  // Обновляем снапшот
  userSnapshots.push({
    ...snapshot,
    timestamp: snapshot.timestamp || new Date()
  });
    
    // Ограничиваем количество хранимых снапшотов (имитация TTL)
    if (userSnapshots.length > 100) {
      userSnapshots.shift();
    }
    
    this.snapshots.set(userId, userSnapshots);
  }
  
  /**
   * Получить историю снапшотов пользователя
   * @param userId ID пользователя
   * @param limit Максимальное количество снапшотов (по умолчанию 10)
   * @returns Массив снапшотов, отсортированных по времени (новые в конце)
   */
  async getSnapshotHistory(userId: string, limit: number = 10): Promise<EmotionSnapshot[]> {
    const userSnapshots = this.snapshots.get(userId) || [];
    return userSnapshots.slice(-limit);
  }
}

/**
 * Класс для управления эмоциональными снапшотами
 */
export class StateManager {
  private storage: SnapshotStorage;
  
  /**
   * Создает экземпляр StateManager
   * @param useRedis Флаг использования Redis (по умолчанию false для локальной разработки)
   */
  constructor(useRedis: boolean = false) {
    // В локальной разработке всегда используем мок-хранилище
    this.storage = new MockSnapshotStorage();
    
    console.log(`StateManager initialized with ${useRedis ? 'Redis' : 'mock'} storage`);
  }
  
  /**
   * Получить текущее эмоциональное состояние пользователя
   * @param userId ID пользователя
   * @returns Текущий снапшот или дефолтный снапшот, если нет данных
   */
  async getCurrentState(userId: string): Promise<EmotionSnapshot> {
    const snapshot = await this.storage.getCurrentSnapshot(userId);
    
    if (snapshot) {
      return snapshot;
    }
    
    // Если снапшота нет, возвращаем дефолтный
    return this.createDefaultSnapshot();
  }
  
  /**
   * Обновить эмоциональное состояние пользователя
   * @param userId ID пользователя
   * @param snapshot Новый снапшот
   */
  async updateState(userId: string, snapshot: EmotionSnapshot): Promise<void> {
    await this.storage.updateSnapshot(userId, snapshot);
  }
  
  /**
   * Получить историю эмоциональных состояний пользователя
   * @param userId ID пользователя
   * @param limit Максимальное количество снапшотов
   * @returns Массив снапшотов
   */
  async getHistory(userId: string, limit: number = 10): Promise<EmotionSnapshot[]> {
    return await this.storage.getSnapshotHistory(userId, limit);
  }
  
  /**
   * Создать дефолтный снапшот для нового пользователя
   * @returns Дефолтный снапшот
   */
  private createDefaultSnapshot(): EmotionSnapshot {
    return {
      userId: 'default',
      emotions: [],
      dominantEmotion: {
        tone: 'neutral',
        score: 50,
        confidence: 0.5,
        keywords: []
      },
      messageCount: 0,
      timestamp: new Date(),
      lastUpdated: new Date(),
      prompt: 'Практикуйте осознанность и глубокое дыхание'
    };
  }
}

/**
 * Экспортируем синглтон для использования в приложении
 */
export const stateManager = new StateManager(process.env.ENABLE_REDIS === 'true');
