/**
 * Тестовый скрипт для Garden Calm
 * 
 * Проверяет интеграцию всех компонентов системы:
 * - Classifier Layer
 * - State Manager
 * - DeepSeek Worker
 * - Haiku Integration
 */

import { classifyMessage } from '../app/api/chat/classifier';
import { StateManager } from '../app/api/chat/state-manager';
import { analysisQueue } from '../workers/deepseek';
import { haikuClient, createHaikuPrompt } from '../lib/ai/haiku';
import { Message } from '@gc/types';

/**
 * Тестовые сообщения для проверки системы
 */
const testMessages: { content: string, expectedEmotion: string }[] = [
  { content: "Я чувствую себя прекрасно сегодня!", expectedEmotion: "positive" },
  { content: "Мне очень грустно и тоскливо", expectedEmotion: "sad" },
  { content: "Я так зол на своего начальника", expectedEmotion: "angry" },
  { content: "Меня беспокоит предстоящее собеседование", expectedEmotion: "anxious" },
  { content: "Я не хочу больше жить, все бессмысленно", expectedEmotion: "sad" },
  { content: "Сегодня обычный день, ничего особенного", expectedEmotion: "neutral" }
];

/**
 * Запускает тестирование всех компонентов
 */
async function runTests() {
  console.log("=== Garden Calm Integration Tests ===");
  
  // Инициализируем State Manager
  const stateManager = new StateManager(false);
  const userId = "test-user-" + Date.now();
  
  console.log(`\n1. Testing Classifier Layer`);
  for (const test of testMessages) {
    const result = await classifyMessage(test.content);
    console.log(`Message: "${test.content}"`);
    console.log(`Classified as: ${result.emotion.tone} (Expected: ${test.expectedEmotion})`);
    console.log(`Score: ${result.emotion.score}, Confidence: ${result.emotion.confidence}`);
    console.log(`Keywords: ${result.emotion.keywords.join(', ')}`);
    console.log(`Needs deep analysis: ${result.needsDeepAnalysis}`);
    console.log("---");
  }
  
  console.log(`\n2. Testing State Manager`);
  // Получаем начальное состояние
  const initialState = await stateManager.getCurrentState(userId);
  console.log("Initial state:", initialState);
  
  // Обновляем состояние
  const classificationResult = await classifyMessage("Я чувствую тревогу из-за предстоящего экзамена");
  await stateManager.updateState(userId, {
    ...initialState,
    dominantEmotion: classificationResult.emotion,
    messageCount: initialState.messageCount + 1,
    lastUpdated: new Date()
  });
  
  // Получаем обновленное состояние
  const updatedState = await stateManager.getCurrentState(userId);
  console.log("Updated state:", updatedState);
  
  console.log(`\n3. Testing DeepSeek Worker`);
  // Создаем тестовые сообщения
  const messages: Message[] = [
    { 
      id: "msg1", 
      userId: userId, 
      role: "user", 
      content: "Привет, я чувствую себя подавленно сегодня",
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 минут назад
    },
    { 
      id: "msg2", 
      userId: userId, 
      role: "assistant", 
      content: "Мне жаль слышать, что вы чувствуете себя подавленно. Что произошло?",
      timestamp: new Date(Date.now() - 1000 * 60 * 4) // 4 минуты назад
    },
    { 
      id: "msg3", 
      userId: userId, 
      role: "user", 
      content: "У меня проблемы на работе, и я не знаю, что делать",
      timestamp: new Date(Date.now() - 1000 * 60 * 3) // 3 минуты назад
    }
  ];
  
  // Добавляем задачу в очередь
  await analysisQueue.push({
    userId,
    messages,
    currentSnapshot: updatedState,
    createdAt: Date.now()
  });
  
  console.log(`Task added to queue. Queue length: ${analysisQueue.getQueueLength()}`);
  console.log("Waiting for processing...");
  
  // Ждем обработки (в реальном приложении это было бы асинхронно)
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  console.log(`\n4. Testing Haiku Integration`);
  // Генерируем ответ с помощью Haiku
  const response = await haikuClient.generateResponse(messages, updatedState);
  console.log("Generated response:", response);
  
  // Создаем промпт для Haiku
  const prompt = createHaikuPrompt(messages, updatedState);
  console.log("\nHaiku prompt sample:");
  console.log(prompt.substring(0, 300) + "...");
  
  console.log("\n=== Tests completed ===");
}

// Запускаем тесты
runTests().catch(console.error);
