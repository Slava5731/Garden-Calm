import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  status: 'online' | 'thinking' | 'offline';
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ status }) => {
  // Определяем статус AI для отображения
  const statusText = {
    online: 'Онлайн',
    thinking: 'Обрабатывает...',
    offline: 'Офлайн'
  };

  const statusColor = {
    online: 'bg-green-500',
    thinking: 'bg-yellow-500',
    offline: 'bg-gray-500'
  };

  return (
    <motion.header 
      className="flex items-center justify-between p-4 border-b border-gray-200 bg-white dark:bg-gray-800 rounded-t-2xl shadow-soft"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3">
        <div className="relative h-10 w-10">
          <Image 
            src="/logo.svg" 
            alt="Garden Calm Logo" 
            width={40} 
            height={40}
            className="rounded-full"
          />
        </div>
        <div>
          <h1 className="font-semibold text-lg text-primary dark:text-green-400">Garden Calm</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI-коуч медитаций</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className={`h-2.5 w-2.5 rounded-full ${statusColor[status]} mr-2`}></span>
        <span className="text-sm text-gray-600 dark:text-gray-300">{statusText[status]}</span>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
