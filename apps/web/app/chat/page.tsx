'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

// Импортируем типы и доменную логику
import { Message as MessageType, Emotion, EmotionTone } from '@gc/types';
import { EmotionAnalyzer, MeditationRecommender } from '@gc/domain';

import ChatHeader from '../../components/ChatHeader';
import MessageList from '../../components/MessageList';
import ChatInput from '../../components/ChatInput';
import EmotionIndicator from '../../components/EmotionIndicator';

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'online' | 'thinking' | 'offline'>('online');
  const [currentEmotion, setCurrentEmotion] = useState<{ type: EmotionTone; score: number }>({
    type: 'neutral',
    score: 50
  });
  
  // Инициализируем сервисы из доменной логики
  const emotionAnalyzer = new EmotionAnalyzer();
  const meditationRecommender = new MeditationRecommender();

  // Функция для отправки сообщения
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Создаем новое сообщение пользователя
    const userMessage: MessageType = {
      id: uuidv4(),
      userId: 'user-123',
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Добавляем сообщение пользователя в список
    setMessages(prev => [...prev, userMessage]);
    
    // Устанавливаем статус AI в "думает"
    setIsLoading(true);
    setAiStatus('thinking');

    try {
      // Анализируем эмоцию с помощью доменной логики
      const emotion = emotionAnalyzer.analyzeEmotion(content);
      
      // Получаем рекомендации медитаций на основе эмоции
      const recommendedMeditations = meditationRecommender.recommendMeditations(emotion, 2);
      
      // Формируем ответ на основе анализа эмоций и рекомендаций
      let responseContent = '';
      
      if (emotion.tone === 'positive') {
        responseContent = `Я чувствую вашу ${emotion.keywords[0] || 'позитивную энергию'}! Это замечательно. `;
      } else if (emotion.tone === 'anxious') {
        responseContent = `Я понимаю, что вы испытываете тревогу. Давайте поработаем с этим чувством. `;
      } else if (emotion.tone === 'sad') {
        responseContent = `Я вижу, что вам грустно. Это нормально - позволить себе эти чувства. `;
      } else if (emotion.tone === 'angry') {
        responseContent = `Я чувствую ваше раздражение. Давайте найдем способ трансформировать эту энергию. `;
      } else {
        responseContent = `Спасибо, что поделились своими мыслями. `;
      }
      
      // Добавляем рекомендации медитаций
      if (recommendedMeditations.length > 0) {
        responseContent += `\n\nЯ рекомендую вам попробовать медитацию "${recommendedMeditations[0].title}" (${recommendedMeditations[0].duration} мин). ${recommendedMeditations[0].description}.`;
        
        if (recommendedMeditations.length > 1) {
          responseContent += `\n\nТакже подойдет "${recommendedMeditations[1].title}" (${recommendedMeditations[1].duration} мин).`;
        }
      }
      
      // Создаем новое сообщение от ассистента
      const assistantMessage: MessageType = {
        id: uuidv4(),
        userId: 'assistant-1',
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        emotion: emotion
      };

      // Добавляем сообщение ассистента в список с небольшой задержкой для эффекта печатания
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        setAiStatus('online');
        
        // Обновляем текущую эмоцию
        setCurrentEmotion({
          type: emotion.tone,
          score: emotion.score
        });
      }, 1500);
      
    } catch (error) {
      console.error('Ошибка:', error);
      
      // Добавляем сообщение об ошибке
      const errorMessage: MessageType = {
        id: uuidv4(),
        userId: 'assistant-1',
        content: 'Извините, произошла ошибка при обработке вашего сообщения. Пожалуйста, попробуйте еще раз.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setAiStatus('online');
    }
  };

  // Добавляем приветственное сообщение при первой загрузке
  useEffect(() => {
    const welcomeMessage: MessageType = {
      id: uuidv4(),
      userId: 'assistant-1',
      content: 'Привет! Я AI-коуч Garden Calm. Расскажите, как вы себя чувствуете сегодня, и я помогу подобрать подходящую медитацию.',
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, []);

  return (
    <motion.div 
      className="flex flex-col h-screen max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-medium rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ChatHeader status={aiStatus} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList messages={messages} />
        
        <div className="p-2 flex justify-center">
          <EmotionIndicator emotion={currentEmotion.type} score={currentEmotion.score} />
        </div>
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}
