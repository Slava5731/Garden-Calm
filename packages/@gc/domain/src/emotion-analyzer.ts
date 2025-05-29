/**
 * Сервис для анализа эмоций в сообщениях пользователя
 */

import { Emotion, EmotionTone, Message } from '@gc/types';

/**
 * Класс для анализа эмоций в сообщениях пользователя
 */
export class EmotionAnalyzer {
  /**
   * Анализирует эмоцию в сообщении пользователя
   * @param message Сообщение для анализа
   * @returns Объект с информацией об эмоции
   */
  public analyzeEmotion(message: string): Emotion {
    // В реальном приложении здесь будет интеграция с AI-сервисом
    // Сейчас используем простую логику на основе ключевых слов
    
    const lowerMessage = message.toLowerCase();
    let tone: EmotionTone = 'neutral';
    let score = 50;
    let confidence = 0.7;
    const keywords: string[] = [];
    
    // Определяем эмоцию на основе ключевых слов
    if (this.containsAny(lowerMessage, ['счастлив', 'радост', 'хорош', 'отлично', 'прекрасно'])) {
      tone = 'positive';
      score = 85;
      confidence = 0.8;
      keywords.push(...this.findKeywords(lowerMessage, ['счастлив', 'радост', 'хорош', 'отлично', 'прекрасно']));
    } else if (this.containsAny(lowerMessage, ['взволнован', 'энерги', 'возбужден', 'активн'])) {
      tone = 'excited';
      score = 75;
      confidence = 0.7;
      keywords.push(...this.findKeywords(lowerMessage, ['взволнован', 'энерги', 'возбужден', 'активн']));
    } else if (this.containsAny(lowerMessage, ['тревог', 'беспоко', 'волну', 'страх', 'пережива'])) {
      tone = 'anxious';
      score = 65;
      confidence = 0.75;
      keywords.push(...this.findKeywords(lowerMessage, ['тревог', 'беспоко', 'волну', 'страх', 'пережива']));
    } else if (this.containsAny(lowerMessage, ['грус', 'печал', 'тоск', 'уныл', 'депрессия'])) {
      tone = 'sad';
      score = 60;
      confidence = 0.8;
      keywords.push(...this.findKeywords(lowerMessage, ['грус', 'печал', 'тоск', 'уныл', 'депрессия']));
    } else if (this.containsAny(lowerMessage, ['зл', 'раздраж', 'ненави', 'бес', 'ярост'])) {
      tone = 'angry';
      score = 70;
      confidence = 0.85;
      keywords.push(...this.findKeywords(lowerMessage, ['зл', 'раздраж', 'ненави', 'бес', 'ярост']));
    } else if (this.containsAny(lowerMessage, ['плох', 'ужас', 'отврат', 'негатив', 'неприятн'])) {
      tone = 'negative';
      score = 55;
      confidence = 0.7;
      keywords.push(...this.findKeywords(lowerMessage, ['плох', 'ужас', 'отврат', 'негатив', 'неприятн']));
    } else {
      // Если не нашли явных эмоций, считаем нейтральной
      tone = 'neutral';
      score = 50;
      confidence = 0.9;
      keywords.push('нейтральное сообщение');
    }
    
    return {
      tone,
      score,
      confidence,
      keywords
    };
  }
  
  /**
   * Проверяет, содержит ли сообщение хотя бы одно из ключевых слов
   */
  private containsAny(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }
  
  /**
   * Находит ключевые слова в сообщении
   */
  private findKeywords(message: string, keywords: string[]): string[] {
    return keywords.filter(keyword => message.includes(keyword));
  }
}
