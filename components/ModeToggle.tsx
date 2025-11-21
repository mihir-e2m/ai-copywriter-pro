
import React from 'react';
import type { AppMode } from '../types';

interface ModeToggleProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const FormIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="flex justify-center my-8">
      <div className="relative flex w-full max-w-md p-1 bg-[#0A101A]/50 rounded-xl border border-white/10">
        <div 
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-orange-600 rounded-lg transition-transform duration-300 ease-in-out
            ${mode === 'form' ? 'translate-x-1' : 'translate-x-[calc(100%+3px)]'}`}
        />
        <button
          onClick={() => setMode('form')}
          className={`relative z-10 w-1/2 py-3 px-4 rounded-lg flex items-center justify-center font-semibold transition-colors duration-300 ${mode === 'form' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
          aria-selected={mode === 'form'}
          role="tab"
        >
          <FormIcon /> Form
        </button>
        <button
          onClick={() => setMode('chat')}
          className={`relative z-10 w-1/2 py-3 px-4 rounded-lg flex items-center justify-center font-semibold transition-colors duration-300 ${mode === 'chat' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
          aria-selected={mode === 'chat'}
          role="tab"
        >
          <ChatIcon /> Chat
        </button>
      </div>
    </div>
  );
};
