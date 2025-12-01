import React from 'react';
import { StatCard } from './StatCard';
import { AgentUsageCard } from './AgentUsageCard';
import type { AgentType } from '../../utils/dashboardUtils';

interface DashboardStatsProps {
  totalConversations: number;
  totalMessages: number;
  conversationsByAgent: {
    copywriting: number;
    socialMedia: number;
    email: number;
  };
  onAgentClick: (agent: AgentType) => void;
  isLoading?: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {/* Total Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-32"></div>
      <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-32"></div>
    </div>
    
    {/* Agent Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-64"></div>
      <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-64"></div>
      <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-64"></div>
    </div>
  </div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalConversations,
  totalMessages,
  conversationsByAgent,
  onAgentClick,
  isLoading = false
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Total Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <StatCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          label="Total Conversations"
          value={totalConversations}
        />
        <StatCard
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          }
          label="Total Messages"
          value={totalMessages}
        />
      </div>

      {/* Agent Usage Breakdown */}
      <div>
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Agent Usage
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your activity across all AI assistants
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AgentUsageCard
            agent="copywriting"
            conversationCount={conversationsByAgent.copywriting}
            totalConversations={totalConversations}
            onStartChat={() => onAgentClick('copywriting')}
          />
          <AgentUsageCard
            agent="social-media"
            conversationCount={conversationsByAgent.socialMedia}
            totalConversations={totalConversations}
            onStartChat={() => onAgentClick('social-media')}
          />
          <AgentUsageCard
            agent="email"
            conversationCount={conversationsByAgent.email}
            totalConversations={totalConversations}
            onStartChat={() => onAgentClick('email')}
          />
        </div>
      </div>
    </div>
  );
};
