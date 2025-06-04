import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupWebSocketServer } from './websocket';
import messageRouter from './routes/message';

// Загружаем переменные окружения
dotenv.config();

// Создаем экземпляр Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api', messageRouter);

// Базовый маршрут для проверки работоспособности
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Garden Calm API' });
});

// Запускаем сервер
const server = app.listen(PORT, () => {
  console.log(`Garden Calm API запущен на порту ${PORT}`);
});

// Настраиваем WebSocket сервер
setupWebSocketServer(server);

// Обработка завершения работы
process.on('SIGTERM', () => {
  console.log('SIGTERM получен, закрываем сервер...');
  server.close(() => {
    console.log('Сервер закрыт');
    process.exit(0);
  });
});

export default server;
