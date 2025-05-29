import React from 'react';
import { motion } from 'framer-motion';

export type EmotionType = 'positive' | 'negative' | 'neutral' | 'anxious' | 'sad' | 'angry' | 'excited';

interface EmotionIndicatorProps {
  emotion: EmotionType;
  score: number; // 0-100
}

export const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ emotion, score }) => {
  // Определяем цвет и иконку в зависимости от эмоции
  const getEmotionColor = (emotion: EmotionType) => {
    switch (emotion) {
      case 'positive': return 'bg-green-500';
      case 'excited': return 'bg-yellow-500';
      case 'neutral': return 'bg-blue-400';
      case 'anxious': return 'bg-orange-500';
      case 'sad': return 'bg-indigo-500';
      case 'angry': return 'bg-red-500';
      case 'negative': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getEmotionLabel = (emotion: EmotionType) => {
    switch (emotion) {
      case 'positive': return 'Позитивное';
      case 'excited': return 'Возбужденное';
      case 'neutral': return 'Нейтральное';
      case 'anxious': return 'Тревожное';
      case 'sad': return 'Грустное';
      case 'angry': return 'Злое';
      case 'negative': return 'Негативное';
      default: return 'Неопределенное';
    }
  };

  return (
    <motion.div 
      className="flex items-center p-2 rounded-lg bg-white dark:bg-gray-800 shadow-soft"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-3 h-3 rounded-full ${getEmotionColor(emotion)} mr-2`}></div>
      <div className="text-xs text-gray-600 dark:text-gray-300">
        <span className="font-medium">{getEmotionLabel(emotion)}</span>
        <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 dark:bg-gray-700">
          <div 
            className={`h-1.5 rounded-full ${getEmotionColor(emotion)}`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionIndicator;
