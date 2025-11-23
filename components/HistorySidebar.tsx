import React from 'react';
import type { Conversation } from '../types';

interface HistorySidebarProps {
  conversations: Conversation[];
  currentConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
}

const NewChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ conversations, currentConversationId, onSelectConversation, onNewChat }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-100/80 to-white/80 dark:from-black/20 dark:to-black/10 backdrop-blur-sm flex flex-col shrink-0 border-r border-slate-200 dark:border-white/10">
      <div className="p-4 border-b border-slate-200 dark:border-white/10">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-orange-700 dark:text-white bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 border border-orange-300 dark:border-orange-500/30 rounded-xl hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-500/30 dark:hover:to-orange-600/30 hover:border-orange-400 dark:hover:border-orange-500/50 transition-all duration-200 shadow-sm transform hover:scale-105 active:scale-95"
        >
          <NewChatIcon />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="px-4 pt-4 pb-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">History</h2>
        <nav className="p-2">
          {conversations.map((convo) => (
            <div key={convo.id} className="relative mb-1">
              {convo.id === currentConversationId && (
                <div className="absolute inset-y-1 left-0 w-1 bg-gradient-to-b from-orange-500 to-orange-700 rounded-r-full shadow-lg" />
              )}
              <button
                onClick={() => onSelectConversation(convo.id)}
                className={`w-full text-left block truncate pl-6 pr-3 py-3 text-sm rounded-xl transition-all duration-200 ${
                  convo.id === currentConversationId
                    ? 'text-orange-700 dark:text-white font-bold bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {convo.title}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};