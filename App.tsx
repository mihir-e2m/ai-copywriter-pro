import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { FormPanel } from './components/FormPanel';
import { ChatPanel } from './components/ChatPanel';
import { HistorySidebar } from './components/HistorySidebar';
import { createChatSession, continueChat } from './services/geminiService';
import type { FormState, ChatMessage, Conversation } from './types';
import type { Chat } from '@google/genai';


function buildPromptFromForm(formData: FormState): string {
  return `Please generate copy with the following details:
- Topic / Subject: ${formData.topicSubject}
- Desired Tone: ${formData.tones.join(', ') || 'Not specified'}
- Target Audience: ${formData.audience.join(', ') || 'General'}
- Key Points to Cover:
${formData.keyPoints}
- Approximate Length: ${formData.length} words
- Optional SEO Keywords to include: ${formData.seoKeywords.join(', ') || 'None'}`;
}


const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatRef.current || currentConversationId === null) {
      console.error('No active chat session.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      status: 'sent',
    };
    
    setConversations(prev => prev.map(c => 
        c.id === currentConversationId ? { ...c, messages: [...c.messages, userMessage] } : c
    ));
    setIsLoading(true);

    try {
      const assistantResponseText = await continueChat(chatRef.current, text);
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: assistantResponseText,
        status: 'sent',
      };
       setConversations(prev => prev.map(c => 
        c.id === currentConversationId ? { ...c, messages: [...c.messages, assistantMessage] } : c
    ));
    } catch (error) {
      console.error('Error continuing chat:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Sorry, something went wrong while getting my response.',
        status: 'error',
      };
      setConversations(prev => prev.map(c => 
        c.id === currentConversationId ? { ...c, messages: [...c.messages, errorMessage] } : c
    ));
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const handleFormSubmit = useCallback(async (formData: FormState) => {
    let conversationId = currentConversationId;
    let chat = chatRef.current;

    // If there is no active conversation, create a new one
    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now(),
        title: formData.topicSubject || 'New Conversation',
        messages: [],
      };
      
      chat = createChatSession(`You are a professional copywriter helping a user with their project on the topic: "${formData.topicSubject}".`);
      chatRef.current = chat;
      
      setConversations(prev => [...prev, newConversation]);
      setCurrentConversationId(newConversation.id);
      conversationId = newConversation.id;
    } else if (!chat) {
      // Re-initialize chat for an existing conversation if needed
      const currentConv = conversations.find(c => c.id === conversationId);
      if(currentConv) {
        chat = createChatSession(`You are a professional copywriter helping a user with their project on the topic: "${currentConv.title}".`);
        chatRef.current = chat;
      }
    }
    
    const promptText = buildPromptFromForm(formData);
    
    // Use a slight delay to ensure state updates before sending message
    setTimeout(() => {
        handleSendMessage(promptText);
    }, 0);

  }, [currentConversationId, conversations, handleSendMessage]);


  const handleSelectConversation = useCallback(async (id: number) => {
    const selectedConversation = conversations.find(c => c.id === id);
    if (!selectedConversation) return;
    
    setIsLoading(true);
    const chat = createChatSession(`You are a professional copywriter helping a user with their project on the topic: "${selectedConversation.title}".`);
    chatRef.current = chat;
    setCurrentConversationId(id);
    setIsLoading(false);

  }, [conversations]);

  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null);
    chatRef.current = null;
  }, []);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="h-screen bg-gradient-to-br from-[#020d1f] via-[#1a182e] to-[#593d1c] text-slate-200 flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <HistorySidebar
          conversations={conversations}
          currentConversationId={currentConversation?.id ?? null}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
        />
        <main className="flex-1 flex flex-col p-6 lg:p-8 min-w-0">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold font-space-grotesk text-white text-glow">Copy Writing Agent</h1>
            <p className="text-slate-400 mt-2">Fill the form to get started, or ask a follow-up in the chat.</p>
          </div>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-0 bg-[#0A101A]/50 border border-white/10 rounded-xl overflow-hidden min-h-0">
            <div className="lg:col-span-2 p-6 overflow-y-auto">
              <FormPanel 
                key={currentConversationId || 'new-form'}
                onSubmit={handleFormSubmit} 
              />
            </div>
            <div className="lg:col-span-3 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10">
              <ChatPanel 
                conversation={currentConversation}
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;