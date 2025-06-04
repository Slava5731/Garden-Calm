import React from 'react';
import './App.css';
import ChatContainer from './components/chat/ChatContainer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-700">Garden Calm</h1>
        <p className="text-gray-600">AI-компаньон для эмоциональной поддержки</p>
      </header>
      
      <main className="w-full max-w-2xl">
        <ChatContainer />
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Garden Calm &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;
