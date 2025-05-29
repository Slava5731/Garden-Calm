'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

// Импортируем типы из пакета @gc/types
import { Message as MessageType, Emotion, EmotionTone } from '@gc/types';

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

  // Функция для отправки сообщения
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Создаем новое сообщение пользователя с использованием типа MessageType
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
      // Отправляем запрос на API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content, userId: 'user-123' }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения');
      }

      // Получаем ответ от API
      const data = await response.json();
      
      // Создаем новое сообщение от ассистента с использованием типа MessageType
      const assistantMessage: MessageType = {
        id: uuidv4(),
        userId: 'assistant-1',
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      };

      // Добавляем сообщение ассистента в список
      setMessages(prev => [...prev, assistantMessage]);
      
      // Обновляем эмоцию на основе анализа
      if (data.emotion) {
        setCurrentEmotion({
          type: data.emotion.tone as EmotionTone,
          score: data.emotion.score
        });
      }
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
    } finally {
      // Возвращаем статус AI в "онлайн"
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
