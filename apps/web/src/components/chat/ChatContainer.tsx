import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import { sendMessage } from '../../lib/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your Garden Calm AI companion. How are you feeling today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    // Generate a unique ID for the message
    const newId = Date.now().toString();
    
    // Add user message to the chat
    const userMessage: Message = {
      id: newId,
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Call the backend API
      const response = await sendMessage(text);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      
      // If there are suggestions from the API, add them as a separate message
      if (response.suggestions && response.suggestions.length > 0) {
        const suggestionsText = `I suggest: ${response.suggestions.join(', ')}`;
        const suggestionsMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: suggestionsText,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        
        setMessages((prev) => [...prev, suggestionsMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your message. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-md">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Garden Calm</h2>
        <p className="text-sm opacity-80">Your AI companion for emotional support</p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatContainer;
