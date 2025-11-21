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
    <div className="w-64 bg-black/10 flex flex-col shrink-0">
      <div className="p-4 border-b border-white/10">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-colors"
        >
          <NewChatIcon />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">History</h2>
        <nav className="p-2">
          {conversations.map((convo) => (
            <div key={convo.id} className="relative">
              {convo.id === currentConversationId && (
                <div className="absolute inset-y-1 left-0 w-1 bg-orange-500 rounded-r-full" />
              )}
              <button
                onClick={() => onSelectConversation(convo.id)}
                className={`w-full text-left block truncate pl-6 pr-3 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                  convo.id === currentConversationId
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
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