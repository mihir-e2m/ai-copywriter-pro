
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ModeToggle } from './components/ModeToggle';
import { FormPanel } from './components/FormPanel';
import { ChatPanel } from './components/ChatPanel';
import { generateCopy, continueChat } from './services/geminiService';
import type { FormState, ChatMessage, AppMode } from './types';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('form');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fix: Initialize useRef with null to fix the error "Expected 1 arguments, but got 0".
  // The type is simplified to `Chat | null` by importing the `Chat` type directly.
  const chatRef = useRef<Chat | null>(null);

  const handleFormSubmit = useCallback(async (formData: FormState) => {
    setIsLoading(true);
    setMode('chat');
    setMessages([]); // Start a new chat session

    try {
      const { chat, firstMessage } = await generateCopy(formData);
      chatRef.current = chat;
      setMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          text: firstMessage,
          status: 'sent',
        },
      ]);
    } catch (error) {
      console.error('Error generating copy:', error);
      setMessages([
        {
          id: Date.now(),
          sender: 'assistant',
          text: 'Sorry, I encountered an error. Please try again.',
          status: 'error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatRef.current) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      status: 'sent',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const assistantResponseText = await continueChat(chatRef.current, text);
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: assistantResponseText,
        status: 'sent',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error continuing chat:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Sorry, something went wrong while getting my response.',
        status: 'error',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020d1f] via-[#1a182e] to-[#593d1c] text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-4xl mx-auto">
          <ModeToggle mode={mode} setMode={setMode} />
          <div className="mt-8">
            {mode === 'form' ? (
              <FormPanel onSubmit={handleFormSubmit} />
            ) : (
              <ChatPanel 
                messages={messages} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage} 
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;