/**
 * Тесты для RabbitMQ сервиса
 */
import { RabbitMQService } from '../src/rabbitmq.service';
import amqplib from 'amqplib';

// Мокаем модуль amqplib
jest.mock('amqplib', () => {
  const mockChannel = {
    prefetch: jest.fn().mockResolvedValue(undefined),
    assertExchange: jest.fn().mockResolvedValue(undefined),
    assertQueue: jest.fn().mockResolvedValue(undefined),
    bindQueue: jest.fn().mockResolvedValue(undefined),
    consume: jest.fn().mockResolvedValue(undefined),
    publish: jest.fn().mockReturnValue(true),
    ack: jest.fn(),
    nack: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined)
  };

  const mockConnection = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
    on: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined)
  };

  return {
    connect: jest.fn().mockResolvedValue(mockConnection)
  };
});

describe('RabbitMQService', () => {
  let rabbitService: RabbitMQService;
  let mockConnection: any;
  let mockChannel: any;

  beforeEach(() => {
    jest.clearAllMocks();
    rabbitService = new RabbitMQService();
    mockConnection = (amqplib.connect as jest.Mock).mock.results[0]?.value;
    mockChannel = mockConnection?.createChannel.mock.results[0]?.value;
  });

  test('должен подключаться к RabbitMQ', async () => {
    await rabbitService.connect();
    
    expect(amqplib.connect).toHaveBeenCalled();
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.prefetch).toHaveBeenCalled();
    expect(mockConnection.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mockConnection.on).toHaveBeenCalledWith('close', expect.any(Function));
  });

  test('должен настраивать обмен и очереди', async () => {
    await rabbitService.connect();
    await rabbitService.setup();
    
    expect(mockChannel.assertExchange).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledTimes(2);
    expect(mockChannel.bindQueue).toHaveBeenCalledTimes(2);
  });

  test('должен подписываться на очередь анализа эмоций', async () => {
    const mockCallback = jest.fn();
    
    await rabbitService.connect();
    await rabbitService.consumeEmotionQueue(mockCallback);
    
    expect(mockChannel.consume).toHaveBeenCalled();
    
    // Проверяем обработку сообщения
    const consumeCallback = mockChannel.consume.mock.calls[0][1];
    const mockMsg = {
      content: Buffer.from(JSON.stringify({ test: 'data' })),
    };
    
    await consumeCallback(mockMsg);
    expect(mockCallback).toHaveBeenCalledWith({ test: 'data' });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  test('должен публиковать результат анализа', async () => {
    const mockResult = { id: '123', emotion: 'happy' };
    
    await rabbitService.connect();
    await rabbitService.publishResult(mockResult);
    
    expect(mockChannel.publish).toHaveBeenCalledWith(
      expect.any(String),
      'emotion.result',
      expect.any(Buffer),
      expect.objectContaining({
        persistent: true,
        contentType: 'application/json'
      })
    );
  });

  test('должен корректно закрывать соединение', async () => {
    await rabbitService.connect();
    await rabbitService.close();
    
    expect(mockChannel.close).toHaveBeenCalled();
    expect(mockConnection.close).toHaveBeenCalled();
  });
});
