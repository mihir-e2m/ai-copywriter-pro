import React from 'react';
import type { AgentType } from '../../utils/dashboardUtils';
import { getAgentIcon, formatRelativeTime } from '../../utils/dashboardUtils';

interface ConversationCardProps {
  conversation: {
    id: number;
    title: string;
    agent: AgentType;
    timestamp: number;
    messagePreview: string;
  };
  onClick: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onClick }) => {
  const icon = getAgentIcon(conversation.agent);
  const relativeTime = formatRelativeTime(conversation.timestamp);

  return (
    <button
      onClick={onClick}
      className="w-full text-left group relative bg-gradient-to-r from-white to-orange-50/20 dark:from-slate-900/80 dark:to-slate-800/50 backdrop-blur-xl rounded-xl p-4 shadow-md border border-orange-200/40 dark:border-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      
      <div className="relative flex gap-3">
        {/* Agent Icon Badge */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md group-hover:shadow-orange-500/40 group-hover:scale-105 transition-all duration-200">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Timestamp */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate flex-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {conversation.title}
            </h4>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {relativeTime}
            </span>
          </div>

          {/* Message Preview */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {conversation.messagePreview}
          </p>
        </div>

        {/* Arrow Icon */}
        <div className="flex-shrink-0 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};
