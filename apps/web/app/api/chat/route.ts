import { NextRequest, NextResponse } from 'next/server';

// Мок-функция для анализа эмоций
function analyzeEmotion(message: string) {
  // В реальном приложении здесь будет интеграция с emotion-worker
  const emotions = [
    { tone: 'positive', score: 85, confidence: 0.8 },
    { tone: 'excited', score: 75, confidence: 0.7 },
    { tone: 'neutral', score: 50, confidence: 0.9 },
    { tone: 'anxious', score: 65, confidence: 0.75 },
    { tone: 'sad', score: 60, confidence: 0.8 },
    { tone: 'angry', score: 70, confidence: 0.85 },
    { tone: 'negative', score: 55, confidence: 0.7 }
  ];
  
  // Простая логика определения эмоции на основе ключевых слов
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('счастлив') || lowerMessage.includes('радост') || lowerMessage.includes('хорош')) {
    return emotions[0]; // positive
  } else if (lowerMessage.includes('взволнован') || lowerMessage.includes('энерги') || lowerMessage.includes('возбужден')) {
    return emotions[1]; // excited
  } else if (lowerMessage.includes('тревог') || lowerMessage.includes('беспоко') || lowerMessage.includes('волну')) {
    return emotions[3]; // anxious
  } else if (lowerMessage.includes('грус') || lowerMessage.includes('печал') || lowerMessage.includes('тоск')) {
    return emotions[4]; // sad
  } else if (lowerMessage.includes('зл') || lowerMessage.includes('раздраж') || lowerMessage.includes('ненави')) {
    return emotions[5]; // angry
  } else if (lowerMessage.includes('плох') || lowerMessage.includes('ужас') || lowerMessage.includes('отврат')) {
    return emotions[6]; // negative
  } else {
    return emotions[2]; // neutral по умолчанию
  }
}

// Мок-функция для генерации ответа
function generateResponse(message: string, emotion: any) {
  // В реальном приложении здесь будет интеграция с prompt-worker
  
  const responses = {
    positive: [
      'Замечательно! Ваше позитивное настроение - отличная основа для медитации осознанности. Хотите попробовать 5-минутную практику благодарности?',
      'Прекрасно видеть вас в хорошем настроении! Это идеальное время для медитации на усиление позитивных эмоций. Могу предложить сеанс "Солнечная энергия".'
    ],
    excited: [
      'Я чувствую вашу энергию! Чтобы направить её в продуктивное русло, рекомендую медитацию на фокусировку внимания. Это поможет сконцентрироваться на важных задачах.',
      'Ваше возбуждённое состояние можно сбалансировать с помощью дыхательных практик. Попробуйте медитацию "Спокойный поток".'
    ],
    neutral: [
      'Ваше нейтральное состояние - хорошая отправная точка для любой медитации. Что бы вы хотели улучшить сегодня - сон, концентрацию или общее спокойствие?',
      'В нейтральном состоянии хорошо работает медитация сканирования тела. Она поможет вам лучше осознать свои физические ощущения и углубить практику.'
    ],
    anxious: [
      'Я понимаю, что вы чувствуете тревогу. Медитация "Безопасное место" может помочь вам найти внутреннее спокойствие. Это короткая 7-минутная практика, которая снижает уровень стресса.',
      'Тревожность можно уменьшить с помощью дыхательной медитации 4-7-8. Хотите, я проведу вас через эту технику?'
    ],
    sad: [
      'Я вижу, что вы испытываете грусть. Медитация "Любящая доброта" может помочь вам почувствовать больше тепла и принятия. Это мягкая 10-минутная практика.',
      'В моменты грусти полезна медитация благодарности. Она помогает переключить внимание на позитивные аспекты жизни. Попробуем?'
    ],
    angry: [
      'Я чувствую, что вы испытываете гнев. Медитация "Прохладный ветер" поможет вам успокоиться и отпустить напряжение. Это быстрая 5-минутная практика.',
      'Гнев - это энергия, которую можно трансформировать. Медитация "Трансформация эмоций" поможет вам преобразовать эту энергию в более конструктивное русло.'
    ],
    negative: [
      'Я вижу, что вы испытываете негативные эмоции. Медитация "Горная твердость" поможет вам обрести устойчивость и внутреннюю силу в этот непростой момент.',
      'Негативные эмоции - это часть нашего опыта. Медитация "Принятие" поможет вам научиться принимать их без осуждения и постепенно отпускать.'
    ]
  };
  
  // Выбираем случайный ответ из соответствующей категории
  const emotionType = emotion.tone as keyof typeof responses;
  const responseOptions = responses[emotionType];
  const randomIndex = Math.floor(Math.random() * responseOptions.length);
  
  return responseOptions[randomIndex];
}

export async function POST(request: NextRequest) {
  try {
    // Получаем данные из запроса
    const { message, userId } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Сообщение не может быть пустым' }, { status: 400 });
    }
    
    // Анализируем эмоцию
    const emotion = analyzeEmotion(message);
    
    // Генерируем ответ
    const responseMessage = generateResponse(message, emotion);
    
    // Добавляем заголовки CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // Возвращаем ответ
    return NextResponse.json(
      { 
        message: responseMessage, 
        emotion: emotion,
        userId: userId || 'anonymous'
      }, 
      { headers }
    );
  } catch (error) {
    console.error('Ошибка в API:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' }, 
      { status: 500 }
    );
  }
}

// Обработчик для CORS preflight запросов
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
