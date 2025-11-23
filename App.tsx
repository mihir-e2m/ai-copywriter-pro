import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FormPanel } from './components/FormPanel';
import { ChatPanel } from './components/ChatPanel';
import { HistorySidebar } from './components/HistorySidebar';
import { sendChatMessage, generateContentFromForm, generateBlogFromPrompt } from './services/n8nService';
import type { FormState, ChatMessage, Conversation } from './types';


function buildPromptFromForm(formData: FormState): string {
  return `Create a full blog using the Spotted Fox Digital Marketing Copywriting Agent instructions. The topic is "${formData.topicSubject}". Write it in an ${formData.tones.join(', ') || 'educational, positive, solution-oriented'} tone for ${formData.audience.join(', ') || 'small to medium-sized business owners'}. Include examples that highlight how businesses improved conversions after redesigns, and add one short measurable-results example. Make the blog ${formData.length} words and naturally include SEO keywords such as ${formData.seoKeywords.join(', ') || 'website design agency, website redesign benefits'}. Follow all brand voice rules, use we/us language, speak directly to the reader, stay growth-oriented, avoid negative/problem-only framing, explain any technical terms simply, and end with one clear CTA.
  
  Key Points to Cover:
  ${formData.keyPoints}`;
}


const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (text: string) => {
    let conversationId = currentConversationId;

    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now(),
        title: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
        messages: [],
      };

      setConversations(prev => [...prev, newConversation]);
      setCurrentConversationId(newConversation.id);
      conversationId = newConversation.id;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      status: 'sent',
    };

    setConversations(prev => prev.map(c =>
      c.id === conversationId ? { ...c, messages: [...c.messages, userMessage] } : c
    ));
    setIsLoading(true);

    try {
      // Use n8n webhook for chat
      const assistantResponseText = await sendChatMessage(text);

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: assistantResponseText,
        status: 'sent',
      };
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, assistantMessage] } : c
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Sorry, something went wrong while getting my response.',
        status: 'error',
      };
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, errorMessage] } : c
      ));
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const handleFormSubmit = useCallback(async (formData: FormState) => {
    console.log('Form submitted:', formData);
    let conversationId = currentConversationId;

    const promptText = buildPromptFromForm(formData);
    console.log('Constructed Prompt (for reference):', promptText);

    // If there is no active conversation, create a new one
    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now(),
        title: formData.topicSubject || 'New Conversation',
        messages: [], // Don't add the internal prompt message yet
      };

      setConversations(prev => [...prev, newConversation]);
      setCurrentConversationId(newConversation.id);
      conversationId = newConversation.id;
    }

    setIsLoading(true);

    try {
      console.log('Step 1: Calling Chat API with form data (type: form)...');
      // 1. Call Chat API with form data (type: "form") to get the prompt
      const promptOutput = await generateContentFromForm(formData);
      console.log('Step 1 Complete - Prompt Output:', promptOutput);

      // Show the prompt as a user message
      const promptMessage: ChatMessage = {
        id: Date.now(),
        sender: 'user',
        text: promptOutput,
        status: 'sent',
      };

      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, promptMessage] } : c
      ));

      console.log('Step 2: Calling Generate API with prompt (type: chat)...');
      // 2. Call Generate API with the prompt output (type: "chat") to get the final blog
      const finalBlog = await generateBlogFromPrompt(promptOutput);
      console.log('Step 2 Complete - Final Blog:', finalBlog);

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: finalBlog,
        status: 'sent',
      };

      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, assistantMessage] } : c
      ));

    } catch (error) {
      console.error('Error in generation flow:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Sorry, something went wrong while generating the content. Please check the console for details.',
        status: 'error',
      };
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, errorMessage] } : c
      ));
    } finally {
      setIsLoading(false);
    }

  }, [currentConversationId, conversations]);


  const handleSelectConversation = useCallback(async (id: number) => {
    const selectedConversation = conversations.find(c => c.id === id);
    if (!selectedConversation) return;

    setIsLoading(true);
    setCurrentConversationId(id);
    setIsLoading(false);

  }, [conversations]);

  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null);
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
        <main className="flex-1 flex flex-col p-4 lg:p-6 min-w-0">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold font-space-grotesk text-white text-glow">Copy Writing Agent</h1>
            <p className="text-slate-400 mt-2">Fill the form to get started, or ask a follow-up in the chat.</p>
          </div>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-0 bg-[#0A101A]/50 border border-white/10 rounded-xl overflow-hidden min-h-0">
            <div className="lg:col-span-2 p-4 overflow-y-auto">
              <FormPanel
                key={currentConversationId || 'new-form'}
                onSubmit={handleFormSubmit}
              />
            </div>
            <div className="lg:col-span-3 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden">
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