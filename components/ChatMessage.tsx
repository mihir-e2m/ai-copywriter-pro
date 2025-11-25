import React from 'react';
import type { ChatMessage as Message } from '../types';
import { marked } from 'marked';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';
  const [copied, setCopied] = React.useState(false);

  const createMarkup = (text: string) => {
    // Replace escaped newlines with actual newlines
    const cleanedText = text.replace(/\\n/g, '\n');
    
    // Configure marked options for better rendering
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    return { __html: marked(cleanedText) };
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`flex items-start gap-4 animate-fade-in min-w-0 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-lg ${isAssistant ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
        {isAssistant ? <AssistantIcon /> : <UserIcon />}
      </div>
      <div className="flex flex-col gap-2 max-w-2xl min-w-0">
        <div className={`rounded-2xl px-5 py-4 shadow-lg break-words ${isAssistant ? 'bg-white dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-tl-none' : 'bg-gradient-to-br from-orange-600 to-orange-700 rounded-tr-none text-white'}`}>
          {message.status === 'loading' ? (
              <LoadingDots />
          ) : message.status === 'error' ? (
              <p className="text-red-400">{message.text}</p>
          ) : (
               <div 
                 style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}
                 className={`prose prose-sm md:prose-base max-w-none [&_*]:break-words [&_*]:max-w-full [&_p]:break-words [&_strong]:break-words [&_em]:break-words [&_code]:break-words [&_pre]:whitespace-pre-wrap [&_pre]:break-words ${
                   isAssistant 
                     ? 'prose-slate dark:prose-invert prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-orange-500' 
                     : 'prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-a:text-orange-100 prose-li:marker:text-orange-200'
                 }`} 
                 dangerouslySetInnerHTML={createMarkup(message.text)}
               />
          )}
        </div>
        {message.status === 'sent' && (
          <button
            onClick={handleCopy}
            className={`self-start group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              copied 
                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10'
            }`}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>
    </div>
  );
};