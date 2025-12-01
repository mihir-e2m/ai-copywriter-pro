import React from 'react';
import { ConversationCard } from './ConversationCard';
import type { AgentType } from '../../utils/dashboardUtils';

interface RecentConversationsProps {
  conversations: Array<{
    id: number;
    title: string;
    agent: AgentType;
    timestamp: number;
    messagePreview: string;
  }>;
  onConversationClick: (conversationId: number, agent: AgentType) => void;
  isLoading?: boolean;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-xl h-24"></div>
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
      No conversations yet
    </h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
      Start a conversation with one of our AI agents to see your chat history here
    </p>
  </div>
);

export const RecentConversations: React.FC<RecentConversationsProps> = ({
  conversations,
  onConversationClick,
  isLoading = false
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Recent Conversations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick up where you left off
            </p>
          </div>
        </div>
        {conversations.length > 0 && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
            {Math.min(conversations.length, 5)} of {conversations.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : conversations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2.5">
          {conversations.slice(0, 5).map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onClick={() => onConversationClick(conversation.id, conversation.agent)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
