import React from 'react';
import type { AgentType } from '../../utils/dashboardUtils';
import { getAgentDisplayName, getAgentIcon, calculatePercentage } from '../../utils/dashboardUtils';

interface AgentUsageCardProps {
  agent: AgentType;
  conversationCount: number;
  totalConversations: number;
  onStartChat: () => void;
}

export const AgentUsageCard: React.FC<AgentUsageCardProps> = ({ 
  agent, 
  conversationCount, 
  totalConversations,
  onStartChat 
}) => {
  const percentage = calculatePercentage(conversationCount, totalConversations);
  const displayName = getAgentDisplayName(agent);
  const icon = getAgentIcon(agent);

  return (
    <div className="group relative bg-gradient-to-br from-white to-orange-50/20 dark:from-slate-900/90 dark:to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-orange-200/40 dark:border-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        {/* Agent Icon and Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-orange-500/40 group-hover:scale-105 transition-all duration-300">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
              {displayName}
            </h3>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {conversationCount}
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              conversations
            </span>
          </div>
          
          {/* Percentage Bar */}
          <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            {percentage}% of total
          </p>
        </div>

        {/* Start Chat Button */}
        <button
          onClick={onStartChat}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Start Chat</span>
        </button>
      </div>
    </div>
  );
};
