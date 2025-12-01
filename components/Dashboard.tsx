import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './Header';
import { DashboardStats } from './dashboard/DashboardStats';
import { RecentConversations } from './dashboard/RecentConversations';
import { fetchConversationHistory } from '../services/n8nService';
import { processDashboardData, type AgentType, type ConversationSummary } from '../utils/dashboardUtils';

interface DashboardProps {
  userEmail: string;
  onSelectAgent: (agent: AgentType) => void;
  onSelectConversation: (conversationId: number, agent: AgentType, sessionId: string) => void;
  onLogout: () => void;
  onLogoClick: () => void;
  conversationHistoryCache?: {
    copywriting: any[] | null;
    'social-media': any[] | null;
    email: any[] | null;
  };
  onCacheUpdate?: (cache: {
    copywriting: any[] | null;
    'social-media': any[] | null;
    email: any[] | null;
  }) => void;
  forceRefresh?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userEmail,
  onSelectAgent,
  onSelectConversation,
  onLogout,
  onLogoClick,
  conversationHistoryCache,
  onCacheUpdate,
  forceRefresh = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    totalConversations: 0,
    totalMessages: 0,
    conversationsByAgent: {
      copywriting: 0,
      socialMedia: 0,
      email: 0
    },
    recentConversations: [] as ConversationSummary[]
  });
  
  // Use ref to access latest cache without causing re-renders
  const cacheRef = useRef(conversationHistoryCache);
  const onCacheUpdateRef = useRef(onCacheUpdate);
  
  useEffect(() => {
    cacheRef.current = conversationHistoryCache;
    onCacheUpdateRef.current = onCacheUpdate;
  });

  const fetchDashboardData = useCallback(async () => {
    console.log('🚀 Dashboard: Fetching fresh data');
    setIsLoading(true);
    setError(null);

    try {
      // Always fetch fresh data from API
      console.log('🔄 Fetching conversation history from API');
      const [copywritingResult, socialMediaResult, emailResult] = await Promise.allSettled([
        fetchConversationHistory('copywriting'),
        fetchConversationHistory('social-media'),
        fetchConversationHistory('email')
      ]);

      console.log('📥 API Results:', {
        copywriting: copywritingResult.status,
        socialMedia: socialMediaResult.status,
        email: emailResult.status
      });

      // Extract data from settled promises
      const copywritingHistory = copywritingResult.status === 'fulfilled' ? copywritingResult.value : [];
      const socialMediaHistory = socialMediaResult.status === 'fulfilled' ? socialMediaResult.value : [];
      const emailHistory = emailResult.status === 'fulfilled' ? emailResult.value : [];

      // Check if all requests failed
      if (
        copywritingResult.status === 'rejected' &&
        socialMediaResult.status === 'rejected' &&
        emailResult.status === 'rejected'
      ) {
        throw new Error('Unable to load dashboard data. Please check your connection.');
      }

      // Update cache with fetched data
      const updateFn = onCacheUpdateRef.current;
      if (updateFn) {
        console.log('💾 Updating cache with fresh data');
        updateFn({
          copywriting: copywritingHistory,
          'social-media': socialMediaHistory,
          email: emailHistory
        });
      }

      console.log('⚙️ Processing dashboard data');
      // Process the data
      const processedData = processDashboardData(
        copywritingHistory,
        socialMediaHistory,
        emailHistory
      );

      console.log('✅ Dashboard data processed:', processedData);
      setDashboardData(processedData);
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      console.log('🏁 Dashboard loading complete');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAgentClick = useCallback((agent: AgentType) => {
    onSelectAgent(agent);
  }, [onSelectAgent]);

  const handleConversationClick = useCallback((conversationId: number, agent: AgentType) => {
    // Find the conversation to get its sessionId
    const conversation = dashboardData.recentConversations.find(c => c.id === conversationId);
    if (conversation) {
      onSelectConversation(conversationId, agent, conversation.sessionId);
    }
  }, [dashboardData.recentConversations, onSelectConversation]);

  const handleRetry = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100 dark:from-[#0a0e1a] dark:via-[#1a1625] dark:to-[#2d1810] text-slate-800 dark:text-slate-200 flex flex-col overflow-hidden animate-fade-in">
      <Header
        onLogoClick={onLogoClick}
        userEmail={userEmail}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Dashboard Title */}
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-10 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
              <h1 className="text-4xl lg:text-5xl font-bold font-space-grotesk bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-base text-slate-600 dark:text-slate-400 ml-5">
              Track your AI conversations and usage statistics
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">
                    Error Loading Dashboard
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          <div className="space-y-12">
            {/* Statistics Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <DashboardStats
                totalConversations={dashboardData.totalConversations}
                totalMessages={dashboardData.totalMessages}
                conversationsByAgent={dashboardData.conversationsByAgent}
                onAgentClick={handleAgentClick}
                isLoading={isLoading}
              />
            </div>

            {/* Recent Conversations Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <RecentConversations
                conversations={dashboardData.recentConversations}
                onConversationClick={handleConversationClick}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
