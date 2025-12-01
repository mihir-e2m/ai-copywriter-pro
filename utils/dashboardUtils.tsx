import React from 'react';
import type { Conversation, ChatMessage } from '../types';

export type AgentType = 'copywriting' | 'social-media' | 'email';

export interface ConversationSummary {
  id: number;
  sessionId: string;
  title: string;
  agent: AgentType;
  timestamp: number;
  messageCount: number;
  messagePreview: string;
}

export interface DashboardData {
  totalConversations: number;
  totalMessages: number;
  conversationsByAgent: {
    copywriting: number;
    socialMedia: number;
    email: number;
  };
  recentConversations: ConversationSummary[];
}

/**
 * Process raw conversation history from all agents into dashboard statistics
 */
export function processDashboardData(
  copywritingHistory: any[],
  socialMediaHistory: any[],
  emailHistory: any[]
): DashboardData {
  // Process each agent's history
  const copywritingConversations = processAgentHistory(copywritingHistory, 'copywriting');
  const socialMediaConversations = processAgentHistory(socialMediaHistory, 'social-media');
  const emailConversations = processAgentHistory(emailHistory, 'email');

  // Combine all conversations
  const allConversations = [
    ...copywritingConversations,
    ...socialMediaConversations,
    ...emailConversations
  ];

  // Sort by timestamp (newest first) and take top 5
  const recentConversations = allConversations
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  // Calculate total messages
  const totalMessages = allConversations.reduce((sum, conv) => sum + conv.messageCount, 0);

  return {
    totalConversations: allConversations.length,
    totalMessages,
    conversationsByAgent: {
      copywriting: copywritingConversations.length,
      socialMedia: socialMediaConversations.length,
      email: emailConversations.length
    },
    recentConversations
  };
}

/**
 * Process a single agent's conversation history
 */
function processAgentHistory(history: any[], agent: AgentType): ConversationSummary[] {
  if (!Array.isArray(history) || history.length === 0) {
    return [];
  }

  // Group by sessionId
  const groupedBySession: { [key: string]: any[] } = {};
  history.forEach((record: any) => {
    const sessionId = record.sessionId || 'unknown';
    if (!groupedBySession[sessionId]) {
      groupedBySession[sessionId] = [];
    }
    groupedBySession[sessionId].push(record);
  });

  // Convert to ConversationSummary
  const conversations: ConversationSummary[] = [];
  
  Object.entries(groupedBySession).forEach(([sessionId, records]) => {
    // Sort records by created_at
    const sortedRecords = records.sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Parse chat messages
    let messageCount = 0;
    let firstUserMessage = '';
    let lastMessage = '';

    sortedRecords.forEach((record) => {
      try {
        let chatArray;
        if (typeof record.chat === 'string') {
          chatArray = JSON.parse(record.chat);
        } else {
          chatArray = record.chat;
        }

        if (Array.isArray(chatArray)) {
          chatArray.forEach((chatPair: any) => {
            if (chatPair.user) {
              messageCount++;
              if (!firstUserMessage) {
                firstUserMessage = chatPair.user;
              }
              lastMessage = chatPair.user;
            }
            if (chatPair.agent) {
              messageCount++;
              lastMessage = chatPair.agent;
            }
          });
        }
      } catch (error) {
        console.error('Error parsing chat:', error);
      }
    });

    // Only add conversations with messages
    if (messageCount > 0) {
      const title = firstUserMessage.substring(0, 40) || 'Conversation';
      const latestRecordTime = new Date(sortedRecords[sortedRecords.length - 1].created_at).getTime();

      conversations.push({
        id: Date.now() + Math.random(),
        sessionId,
        title: title + (firstUserMessage.length > 40 ? '...' : ''),
        agent,
        timestamp: latestRecordTime,
        messageCount,
        messagePreview: truncateText(lastMessage, 100)
      });
    }
  });

  return conversations;
}

/**
 * Format timestamp to relative time (e.g., "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks < 4) {
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate percentage with one decimal place
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 1000) / 10;
}

/**
 * Get agent display name
 */
export function getAgentDisplayName(agent: AgentType): string {
  const names = {
    'copywriting': 'Copywriting Agent',
    'social-media': 'Social Media Generator',
    'email': 'Email Writing Tool'
  };
  return names[agent];
}

/**
 * Get agent icon SVG element
 */
export function getAgentIcon(agent: AgentType): React.ReactNode {
  if (agent === 'copywriting') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
  } else if (agent === 'social-media') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
}
