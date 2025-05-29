/**
 * Сервис для управления снапшотами эмоционального состояния пользователя
 */

import { Emotion, EmotionSnapshot, EmotionTone } from '@gc/types';
import { EmotionAnalyzer } from './emotion-analyzer';

/**
 * Класс для управления снапшотами эмоционального состояния
 */
export class EmotionSnapshotManager {
  private emotionAnalyzer: EmotionAnalyzer;
  
  // Мок-хранилище снапшотов (в реальном приложении будет использоваться Redis)
  private snapshots: Map<string, EmotionSnapshot> = new Map();
  
  constructor(emotionAnalyzer?: EmotionAnalyzer) {
    this.emotionAnalyzer = emotionAnalyzer || new EmotionAnalyzer();
  }
  
  /**
   * Создает новый снапшот эмоционального состояния
   * @param userId ID пользователя
   * @param message Сообщение для анализа
   * @returns Созданный снапшот
   */
  public createSnapshot(userId: string, message: string): EmotionSnapshot {
    const emotion = this.emotionAnalyzer.analyzeEmotion(message);
    
    // Проверяем, есть ли уже снапшот для этого пользователя
    const existingSnapshot = this.snapshots.get(userId);
    
    if (existingSnapshot) {
      // Обновляем существующий снапшот
      const updatedSnapshot: EmotionSnapshot = {
        ...existingSnapshot,
        emotions: [...existingSnapshot.emotions, emotion],
        dominantEmotion: this.calculateDominantEmotion([...existingSnapshot.emotions, emotion]),
        messageCount: existingSnapshot.messageCount + 1,
        lastUpdated: new Date()
      };
      
      this.snapshots.set(userId, updatedSnapshot);
      return updatedSnapshot;
    } else {
      // Создаем новый снапшот
      const newSnapshot: EmotionSnapshot = {
        userId,
        emotions: [emotion],
        dominantEmotion: emotion,
        timestamp: new Date(),
        messageCount: 1,
        lastUpdated: new Date()
      };
      
      this.snapshots.set(userId, newSnapshot);
      return newSnapshot;
    }
  }
  
  /**
   * Получает снапшот пользователя
   * @param userId ID пользователя
   * @returns Снапшот или undefined, если не найден
   */
  public getSnapshot(userId: string): EmotionSnapshot | undefined {
    return this.snapshots.get(userId);
  }
  
  /**
   * Рассчитывает доминирующую эмоцию на основе списка эмоций
   * @param emotions Список эмоций
   * @returns Доминирующая эмоция
   */
  private calculateDominantEmotion(emotions: Emotion[]): Emotion {
    if (emotions.length === 0) {
      return {
        tone: 'neutral',
        score: 50,
        confidence: 0.5,
        keywords: []
      };
    }
    
    if (emotions.length === 1) {
      return emotions[0];
    }
    
    // Группируем эмоции по типу
    const emotionGroups = new Map<EmotionTone, Emotion[]>();
    
    emotions.forEach(emotion => {
      const group = emotionGroups.get(emotion.tone) || [];
      group.push(emotion);
      emotionGroups.set(emotion.tone, group);
    });
    
    // Находим тип эмоции с наибольшим количеством вхождений
    let dominantType: EmotionTone = 'neutral';
    let maxCount = 0;
    
    emotionGroups.forEach((group, type) => {
      if (group.length > maxCount) {
        maxCount = group.length;
        dominantType = type;
      }
    });
    
    // Рассчитываем средние значения для доминирующей эмоции
    const dominantGroup = emotionGroups.get(dominantType) || [];
    
    const avgScore = dominantGroup.reduce((sum, emotion) => sum + emotion.score, 0) / dominantGroup.length;
    const avgConfidence = dominantGroup.reduce((sum, emotion) => sum + emotion.confidence, 0) / dominantGroup.length;
    
    // Собираем все ключевые слова
    const allKeywords = dominantGroup.flatMap(emotion => emotion.keywords);
    const uniqueKeywords = [...new Set(allKeywords)];
    
    return {
      tone: dominantType,
      score: Math.round(avgScore),
      confidence: Number(avgConfidence.toFixed(2)),
      keywords: uniqueKeywords
    };
  }
}
