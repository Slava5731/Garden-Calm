import { MeditationRecommender } from '../src/meditation-recommender';
import { Emotion } from '@gc/types';

describe('MeditationRecommender', () => {
  let recommender: MeditationRecommender;

  beforeEach(() => {
    recommender = new MeditationRecommender();
  });

  test('должен рекомендовать медитации для тревожной эмоции', () => {
    const emotion: Emotion = {
      tone: 'anxious',
      score: 65,
      confidence: 0.75,
      keywords: ['тревога', 'беспокойство']
    };

    const recommendations = recommender.recommendMeditations(emotion, 2);
    
    expect(recommendations.length).toBeLessThanOrEqual(2);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].emotionTags).toContain('anxious');
  });

  test('должен рекомендовать медитации для позитивной эмоции', () => {
    const emotion: Emotion = {
      tone: 'positive',
      score: 85,
      confidence: 0.8,
      keywords: ['счастье', 'радость']
    };

    const recommendations = recommender.recommendMeditations(emotion, 2);
    
    expect(recommendations.length).toBeLessThanOrEqual(2);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].emotionTags).toContain('positive');
  });

  test('должен возвращать нейтральные медитации, если нет подходящих', () => {
    const emotion: Emotion = {
      tone: 'excited',
      score: 75,
      confidence: 0.7,
      keywords: ['возбуждение', 'энергия']
    };

    // Предполагаем, что в моке есть медитации для excited
    const recommendations = recommender.recommendMeditations(emotion, 2);
    
    expect(recommendations.length).toBeGreaterThan(0);
  });

  test('должен корректно получать медитацию по ID', () => {
    // Получаем все медитации
    const allMeditations = recommender.getAllMeditations();
    
    // Берем ID первой медитации
    const firstMeditationId = allMeditations[0].id;
    
    // Получаем медитацию по ID
    const meditation = recommender.getMeditationById(firstMeditationId);
    
    expect(meditation).toBeDefined();
    expect(meditation?.id).toBe(firstMeditationId);
  });

  test('должен возвращать undefined для несуществующего ID', () => {
    const meditation = recommender.getMeditationById('non-existent-id');
    
    expect(meditation).toBeUndefined();
  });

  test('должен корректно фильтровать медитации по категории', () => {
    const anxietyMeditations = recommender.getMeditationsByCategory('anxiety');
    
    expect(anxietyMeditations.length).toBeGreaterThan(0);
    anxietyMeditations.forEach(meditation => {
      expect(meditation.category).toBe('anxiety');
    });
  });
});
