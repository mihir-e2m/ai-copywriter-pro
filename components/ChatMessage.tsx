import React from 'react';
import type { ChatMessage as Message } from '../types';
import { marked } from 'marked';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


const LoadingDots: React.FC = () => (
    <div className="flex space-x-1">
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
    </div>
);


const AssistantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  const createMarkup = (text: string) => {
    return { __html: marked(text, { breaks: true, gfm: true }) };
  };

  return (
    <div className={`flex items-start gap-4 animate-fade-in ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-lg ${isAssistant ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
        {isAssistant ? <AssistantIcon /> : <UserIcon />}
      </div>
      <div className={`max-w-2xl rounded-2xl px-5 py-4 shadow-lg ${isAssistant ? 'bg-white dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-tl-none' : 'bg-gradient-to-br from-orange-600 to-orange-700 rounded-tr-none text-white'}`}>
        {message.status === 'loading' ? (
            <LoadingDots />
        ) : message.status === 'error' ? (
            <p className="text-red-400">{message.text}</p>
        ) : (
             <div className={`prose prose-sm max-w-none ${isAssistant ? 'prose-slate dark:prose-invert' : 'prose-invert'}`} dangerouslySetInnerHTML={createMarkup(message.text)}></div>
        )}
      </div>
    </div>
  );
};