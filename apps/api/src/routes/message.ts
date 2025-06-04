import express from 'express';

const router = express.Router();

/**
 * POST /api/message
 * Обрабатывает сообщения пользователя и возвращает ответ AI
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // В будущем здесь будет интеграция с @garden-calm/core для анализа эмоций
    // и генерации ответа через Orchestrator
    
    // Временная имитация ответа AI
    const response = {
      message: `Thank you for sharing. I understand that you said: "${message}". How does that make you feel?`,
      emotionCode: 'NEUTRAL',
      suggestions: ['Take a deep breath', 'Would you like to try a quick meditation?']
    };
    
    // Добавляем небольшую задержку для имитации обработки
    setTimeout(() => {
      res.json(response);
    }, 500);
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
