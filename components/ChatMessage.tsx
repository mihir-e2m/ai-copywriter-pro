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


export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  const createMarkup = (text: string) => {
    return { __html: marked(text, { breaks: true, gfm: true }) };
  };

  return (
    <div className={`flex items-start gap-4 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${isAssistant ? 'bg-slate-800' : 'bg-orange-600'}`}>
        {isAssistant ? <img src="https://spottedfoxdigital.com/wp-content/uploads/2024/11/cropped-Spotted-Fox-Favicon-192x192.png" alt="Assistant Avatar" className="w-full h-full object-cover" /> : <UserIcon />}
      </div>
      <div className={`max-w-xl rounded-xl px-4 py-3 ${isAssistant ? 'bg-slate-800 rounded-tl-none' : 'bg-orange-600 rounded-tr-none text-white'}`}>
        {message.status === 'loading' ? (
            <LoadingDots />
        ) : message.status === 'error' ? (
            <p className="text-red-400">{message.text}</p>
        ) : (
             <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={createMarkup(message.text)}></div>
        )}
      </div>
    </div>
  );
};