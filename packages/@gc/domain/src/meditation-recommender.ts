/**
 * Сервис для рекомендации медитаций на основе эмоционального состояния
 */

import { Emotion, EmotionTone, Meditation, MeditationCategory } from '@gc/types';

/**
 * Класс для рекомендации медитаций
 */
export class MeditationRecommender {
  // Мок-база данных медитаций
  private meditations: Meditation[] = [
    {
      id: 'med-001',
      title: 'Безопасное место',
      description: 'Медитация для снижения тревожности и обретения внутреннего спокойствия',
      duration: 7,
      category: 'anxiety',
      emotionTags: ['anxious', 'negative'],
      difficulty: 'beginner',
      imageUrl: '/meditations/safe-place.jpg'
    },
    {
      id: 'med-002',
      title: 'Солнечная энергия',
      description: 'Медитация для усиления позитивных эмоций и энергии',
      duration: 10,
      category: 'energy',
      emotionTags: ['positive', 'excited'],
      difficulty: 'beginner',
      imageUrl: '/meditations/sun-energy.jpg'
    },
    {
      id: 'med-003',
      title: 'Любящая доброта',
      description: 'Медитация для развития сострадания и принятия себя в моменты грусти',
      duration: 12,
      category: 'relaxation',
      emotionTags: ['sad', 'negative'],
      difficulty: 'intermediate',
      imageUrl: '/meditations/loving-kindness.jpg'
    },
    {
      id: 'med-004',
      title: 'Прохладный ветер',
      description: 'Медитация для трансформации гнева и раздражения в спокойствие',
      duration: 5,
      category: 'relaxation',
      emotionTags: ['angry', 'negative'],
      difficulty: 'beginner',
      imageUrl: '/meditations/cool-breeze.jpg'
    },
    {
      id: 'med-005',
      title: 'Сканирование тела',
      description: 'Базовая медитация для осознанности и присутствия в моменте',
      duration: 15,
      category: 'focus',
      emotionTags: ['neutral', 'anxious'],
      difficulty: 'beginner',
      imageUrl: '/meditations/body-scan.jpg'
    },
    {
      id: 'med-006',
      title: 'Глубокий сон',
      description: 'Медитация для расслабления и подготовки к спокойному сну',
      duration: 20,
      category: 'sleep',
      emotionTags: ['anxious', 'sad', 'neutral'],
      difficulty: 'beginner',
      imageUrl: '/meditations/deep-sleep.jpg'
    }
  ];

  /**
   * Рекомендует медитации на основе эмоционального состояния
   * @param emotion Эмоция пользователя
   * @param limit Максимальное количество рекомендаций
   * @returns Список рекомендованных медитаций
   */
  public recommendMeditations(emotion: Emotion, limit: number = 3): Meditation[] {
    // Сортируем медитации по релевантности для данной эмоции
    const sortedMeditations = this.meditations
      .filter(meditation => meditation.emotionTags.includes(emotion.tone))
      .sort((a, b) => {
        // Приоритет медитациям, которые точно соответствуют эмоции
        const aExactMatch = a.emotionTags[0] === emotion.tone ? 1 : 0;
        const bExactMatch = b.emotionTags[0] === emotion.tone ? 1 : 0;
        
        return bExactMatch - aExactMatch;
      });
    
    // Если нет подходящих медитаций, возвращаем нейтральные
    if (sortedMeditations.length === 0) {
      return this.meditations
        .filter(meditation => meditation.emotionTags.includes('neutral'))
        .slice(0, limit);
    }
    
    return sortedMeditations.slice(0, limit);
  }

  /**
   * Получает медитацию по ID
   * @param id ID медитации
   * @returns Медитация или undefined, если не найдена
   */
  public getMeditationById(id: string): Meditation | undefined {
    return this.meditations.find(meditation => meditation.id === id);
  }

  /**
   * Получает все медитации
   * @returns Список всех медитаций
   */
  public getAllMeditations(): Meditation[] {
    return [...this.meditations];
  }

  /**
   * Фильтрует медитации по категории
   * @param category Категория медитаций
   * @returns Отфильтрованный список медитаций
   */
  public getMeditationsByCategory(category: MeditationCategory): Meditation[] {
    return this.meditations.filter(meditation => meditation.category === category);
  }
}
