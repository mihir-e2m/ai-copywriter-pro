
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
          className="w-full bg-[#0A101A]/50 border border-white/20 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:opacity-50"
          disabled={disabled}
          aria-label="Chat input"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-11 h-11 flex items-center justify-center bg-orange-600 text-white rounded-full transition-all duration-300 hover:bg-orange-500 disabled:bg-slate-700 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
};