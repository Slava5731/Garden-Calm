import { Server as HttpServer } from 'http';
import { Server as WebSocketServer } from 'ws';
import { createEmpathyOrchestrator } from '@garden-calm/core';

export function setupWebSocketServer(server: HttpServer) {
  // Создаем WebSocket сервер
  const wss = new WebSocketServer({ server });

  // Инициализируем оркестратор
  const orchestrator = createEmpathyOrchestrator({
    v3ApiKey: process.env.V3_API_KEY || 'demo-key'
  });

  // Обработка подключений
  wss.on('connection', (ws) => {
    console.log('Новое WebSocket подключение');
    
    // Генерируем уникальный ID для пользователя
    const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Отправляем приветственное сообщение
    ws.send(JSON.stringify({
      type: 'welcome',
      userId,
      timestamp: Date.now()
    }));

    // Обработка сообщений
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'message') {
          // Анализируем сообщение через оркестратор
          const messageId = `msg_${Date.now()}`;
          const result = await orchestrator.analyzeMessage(
            userId,
            data.content,
            messageId
          );
          
          // Отправляем результат анализа
          ws.send(JSON.stringify({
            type: 'analysis',
            result,
            timestamp: Date.now()
          }));
          
          // Если нужно предложить медитацию
          if (result.shouldSuggestMeditation) {
            ws.send(JSON.stringify({
              type: 'meditation_suggestion',
              emotion: result.suggestedEmotion,
              timestamp: Date.now()
            }));
          }
        } else if (data.type === 'meditation_response') {
          // Обрабатываем ответ на предложение медитации
          if (data.accepted) {
            await orchestrator.onMeditationAccepted(userId);
          } else {
            orchestrator.onMeditationDeclined(userId);
          }
        }
      } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Ошибка обработки сообщения',
          timestamp: Date.now()
        }));
      }
    });

    // Обработка отключения
    ws.on('close', () => {
      console.log(`WebSocket соединение закрыто для пользователя ${userId}`);
    });
  });

  // Периодическая очистка старых данных
  setInterval(() => {
    orchestrator.cleanup();
  }, 3600000); // Каждый час

  return wss;
}
