import React, { useState, useCallback } from 'react';
import { ChatPanel } from './ChatPanel';
import { sendChatMessage } from '../services/n8nService';
import type { ChatMessage, Conversation } from '../types';

interface SimpleChatInterfaceProps {
  agentTitle: string;
  agentDescription: string;
  tableName: string;
}

export const SimpleChatInterface: React.FC<SimpleChatInterfaceProps> = ({ agentTitle, agentDescription, tableName }) => {
  const [conversation, setConversation] = useState<Conversation>({
    id: Date.now(),
    title: 'New Conversation',
    messages: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      status: 'sent',
    };

    // Capture current messages before updating state
    let currentMessages: ChatMessage[] = [];
    setConversation(prev => {
      currentMessages = prev.messages;
      return {
        ...prev,
        messages: [...prev.messages, userMessage],
      };
    });

    setIsLoading(true);

    try {
      // Get last 5 messages in API format: [{"user": "hi", "agent": "response"}, ...]
      const previousMessages = [];
      for (let i = 0; i < currentMessages.length; i += 2) {
        const userMsg = currentMessages[i];
        const agentMsg = currentMessages[i + 1];
        if (userMsg && agentMsg) {
          previousMessages.push({
            user: userMsg.text,
            agent: agentMsg.text
          });
        }
      }

      console.log('📝 Current messages count:', currentMessages.length);
      console.log('📝 Previous messages to send:', previousMessages);

      const assistantResponseText = await sendChatMessage(text, tableName, previousMessages);

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: assistantResponseText,
        status: 'sent',
      };

      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Sorry, something went wrong while getting my response.',
        status: 'error',
      };

      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  }, [tableName]);

  return (
    <ChatPanel
      conversation={conversation}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  );
};
