import { EmotionAnalyzer } from '../src/emotion-analyzer';
import { EmotionTone } from '@gc/types';

describe('EmotionAnalyzer', () => {
  let analyzer: EmotionAnalyzer;

  beforeEach(() => {
    analyzer = new EmotionAnalyzer();
  });

  test('должен определять позитивную эмоцию', () => {
    const message = 'Я чувствую себя счастливым и радостным сегодня!';
    const emotion = analyzer.analyzeEmotion(message);

    expect(emotion.tone).toBe('positive');
    expect(emotion.score).toBeGreaterThan(70);
    expect(emotion.confidence).toBeGreaterThan(0.7);
    expect(emotion.keywords.length).toBeGreaterThan(0);
  });

  test('должен определять тревожную эмоцию', () => {
    const message = 'Я очень беспокоюсь и тревожусь о предстоящем событии';
    const emotion = analyzer.analyzeEmotion(message);

    expect(emotion.tone).toBe('anxious');
    expect(emotion.score).toBeGreaterThan(50);
    expect(emotion.confidence).toBeGreaterThan(0.7);
    expect(emotion.keywords.length).toBeGreaterThan(0);
  });

  test('должен определять грустную эмоцию', () => {
    const message = 'Мне очень грустно и тоскливо сегодня';
    const emotion = analyzer.analyzeEmotion(message);

    expect(emotion.tone).toBe('sad');
    expect(emotion.score).toBeGreaterThan(50);
    expect(emotion.confidence).toBeGreaterThan(0.7);
    expect(emotion.keywords.length).toBeGreaterThan(0);
  });

  test('должен определять злую эмоцию', () => {
    const message = 'Я очень зол и раздражен из-за этой ситуации!';
    const emotion = analyzer.analyzeEmotion(message);

    expect(emotion.tone).toBe('angry');
    expect(emotion.score).toBeGreaterThan(50);
    expect(emotion.confidence).toBeGreaterThan(0.7);
    expect(emotion.keywords.length).toBeGreaterThan(0);
  });

  test('должен определять нейтральную эмоцию для обычного сообщения', () => {
    const message = 'Сегодня обычный день, ничего особенного';
    const emotion = analyzer.analyzeEmotion(message);

    expect(emotion.tone).toBe('neutral');
    expect(emotion.score).toBe(50);
    expect(emotion.confidence).toBeGreaterThan(0.7);
  });

  test('должен корректно обрабатывать пустое сообщение', () => {
    const message = '';
    const emotion = analyzer.analyzeEmotion(message);

    expect(emotion.tone).toBe('neutral');
    expect(emotion.score).toBe(50);
    expect(emotion.confidence).toBeGreaterThan(0.7);
  });
});
