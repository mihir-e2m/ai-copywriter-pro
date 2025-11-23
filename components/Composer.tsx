
import React, { useState } from 'react';

interface ComposerProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

export const Composer: React.FC<ComposerProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a follow-up or give a new instruction..."
          className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-white/20 rounded-xl px-5 py-3.5 pr-12 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:opacity-50 hover:border-slate-400 dark:hover:border-white/30 shadow-sm"
          disabled={disabled}
          aria-label="Chat input"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full transition-all duration-300 hover:shadow-lg disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 shadow-md"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
};