import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FormPanel } from './components/FormPanel';
import { ChatPanel } from './components/ChatPanel';
import { HistorySidebar } from './components/HistorySidebar';
import { SimpleChatInterface } from './components/SimpleChatInterface';
import { sendChatMessage, generateContentFromForm, generateBlogFromPrompt, resetSessionId, fetchConversationHistory, setSessionId } from './services/n8nService';
import type { FormState, ChatMessage, Conversation } from './types';

type AgentType = 'copywriting' | 'social-media' | 'email';

// Map agent types to table names
function getTableNameForAgent(agent: AgentType): string {
  const tableNameMap = {
    'copywriting': 'copyWriter',
    'social-media': 'socialMediaWriter',
    'email': 'emailWriter'
  };
  return tableNameMap[agent];
}

function buildPromptFromForm(formData: FormState): string {
  return `Create a full blog using the Spotted Fox Digital Marketing Copywriting Agent instructions. The topic is "${formData.topicSubject}". Write it in an ${formData.tones.join(', ') || 'educational, positive, solution-oriented'} tone for ${formData.audience.join(', ') || 'small to medium-sized business owners'}. Include examples that highlight how businesses improved conversions after redesigns, and add one short measurable-results example. Make the blog ${formData.length} words and naturally include SEO keywords such as ${formData.seoKeywords.join(', ') || 'website design agency, website redesign benefits'}. Follow all brand voice rules, use we/us language, speak directly to the reader, stay growth-oriented, avoid negative/problem-only framing, explain any technical terms simply, and end with one clear CTA.
  
  Key Points to Cover:
  ${formData.keyPoints}`;
}


const App: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSelectAgent = useCallback(async (agent: AgentType) => {
    setSelectedAgent(agent);
    setCurrentConversationId(null);
    setShowForm(true);
    resetSessionId(); // Reset session ID when switching agents

    // Fetch conversation history for the selected agent
    try {
      const history = await fetchConversationHistory(agent);
      console.log('📚 Fetched conversation history:', history);

      // Group messages by sessionId
      const groupedBySession: { [key: string]: any[] } = {};
      history.forEach((message: any) => {
        const sessionId = message.sessionId || 'unknown';
        if (!groupedBySession[sessionId]) {
          groupedBySession[sessionId] = [];
        }
        groupedBySession[sessionId].push(message);
      });

      console.log('📊 Total records fetched:', history.length);
      console.log('📊 Grouped into sessions:', Object.keys(groupedBySession).length);

      // Convert grouped messages to conversations
      const loadedConversations: Conversation[] = Object.entries(groupedBySession)
        .map(([sessionId, records]) => {
          // Sort records by created_at (oldest first)
          const sortedRecords = records.sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

          // Parse chat messages from each record
          const chatMessages: ChatMessage[] = [];
          let messageIdCounter = 0;

          sortedRecords.forEach((record) => {
            try {
              console.log('🔍 Processing record chat:', record.chat);
              console.log('🔍 Chat type:', typeof record.chat);

              // Check if chat is already an object or a string
              let chatArray;
              if (typeof record.chat === 'string') {
                chatArray = JSON.parse(record.chat);
              } else {
                chatArray = record.chat;
              }
              console.log('✅ Chat array:', chatArray);

              // Each item in chatArray is like {"user": "hi", "agent": "hello"}
              chatArray.forEach((chatPair: any) => {
                console.log('💬 Processing chat pair:', chatPair);
                // Add user message if exists
                if (chatPair.user) {
                  const userMsg = {
                    id: messageIdCounter++,
                    sender: 'user' as const,
                    text: chatPair.user,
                    status: 'sent' as const
                  };
                  console.log('👤 Adding user message:', userMsg);
                  chatMessages.push(userMsg);
                }

                // Add agent message if exists
                if (chatPair.agent) {
                  const agentMsg = {
                    id: messageIdCounter++,
                    sender: 'assistant' as const,
                    text: chatPair.agent,
                    status: 'sent' as const
                  };
                  console.log('🤖 Adding agent message:', agentMsg);
                  chatMessages.push(agentMsg);
                }
              });
            } catch (parseError) {
              console.error('❌ Error parsing chat JSON:', parseError, record.chat);
            }
          });

          console.log('📨 Total chat messages created:', chatMessages.length);
          console.log('📨 Chat messages:', chatMessages);

          // Get the first user message for the title
          const firstUserMessage = chatMessages.find(m => m.sender === 'user');
          const title = firstUserMessage?.text?.substring(0, 40) || 'Conversation';

          // Get the latest record timestamp for sorting conversations
          const latestRecordTime = new Date(sortedRecords[sortedRecords.length - 1].created_at).getTime();

          return {
            id: Date.now() + Math.random(), // Generate unique ID
            title: title + (title.length > 40 ? '...' : ''),
            messages: chatMessages,
            timestamp: latestRecordTime,
            sessionId: sessionId // Store the session ID with the conversation
          };
        })
        // Sort conversations by latest message (newest first)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      setConversations(loadedConversations);
      console.log('✅ Loaded conversations:', loadedConversations.length);
    } catch (error) {
      console.error('❌ Error loading conversation history:', error);
      setConversations([]);
    }
  }, []);

  const handleLogoClick = useCallback(() => {
    setSelectedAgent(null);
    setConversations([]);
    setCurrentConversationId(null);
    setShowForm(true);
    resetSessionId(); // Reset session ID when going back to agent selection
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    let conversationId = currentConversationId;

    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now(),
        title: text.slice(0, 40) + (text.length > 40 ? '...' : ''),
        messages: [],
        timestamp: Date.now(),
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

    // Get current conversation messages before updating
    const currentConversation = conversations.find(c => c.id === conversationId);
    const currentMessages = currentConversation?.messages || [];

    setConversations(prev => prev.map(c =>
      c.id === conversationId ? { ...c, messages: [...c.messages, userMessage] } : c
    ));

    // Hide form after first message
    setShowForm(false);
    setIsLoading(true);

    try {
      // Prepare previous messages in API format: [{"user": "hi", "agent": "response"}, ...]
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

      // Use n8n webhook for chat with tableName and previous messages
      const tableName = selectedAgent ? getTableNameForAgent(selectedAgent) : undefined;
      const assistantResponseText = await sendChatMessage(text, tableName, previousMessages);

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
  }, [currentConversationId, selectedAgent, conversations]);

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
        messages: [],
        timestamp: Date.now(),
      };

      setConversations(prev => [...prev, newConversation]);
      setCurrentConversationId(newConversation.id);
      conversationId = newConversation.id;
    }

    // Create a user-friendly summary of the form inputs
    const userSummary = `Topic: ${formData.topicSubject}
Tone: ${formData.tones.join(', ')}
${formData.audience.length > 0 ? `Audience: ${formData.audience.join(', ')}` : ''}
Length: ~${formData.length} words
${formData.seoKeywords.length > 0 ? `SEO Keywords: ${formData.seoKeywords.join(', ')}` : ''}

Key Points:
${formData.keyPoints}`;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: userSummary,
      status: 'sent',
    };

    // Get current conversation messages before updating
    const currentConversation = conversations.find(c => c.id === conversationId);
    const currentMessages = currentConversation?.messages || [];

    setConversations(prev => prev.map(c =>
      c.id === conversationId ? { ...c, messages: [userMessage] } : c
    ));

    // Immediately hide form and show loading
    setShowForm(false);
    setIsLoading(true);

    try {
      console.log('Step 1: Calling Generate API with form data to get prompt...');
      // 1. Call Generate API with form data (type: "form") to get the prompt
      const promptOutput = await generateContentFromForm(formData);
      console.log('Step 1 Complete - Prompt Output:', promptOutput);

      // Prepare previous messages in API format: [{"user": "hi", "agent": "response"}, ...]
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

      console.log('Step 2: Calling Chat API with prompt to get final blog...');
      // 2. Call Chat API with the prompt output (type: "chat") to get the final blog
      const tableName = selectedAgent ? getTableNameForAgent(selectedAgent) : undefined;
      const finalBlog = await sendChatMessage(promptOutput, tableName, previousMessages);
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

  }, [currentConversationId, conversations, selectedAgent]);


  const handleSelectConversation = useCallback(async (id: number) => {
    const selectedConversation = conversations.find(c => c.id === id);
    if (!selectedConversation) {
      console.log('❌ Conversation not found:', id);
      return;
    }

    console.log('✅ Selected conversation:', selectedConversation);
    console.log('📝 Messages in conversation:', selectedConversation.messages.length);
    console.log('🆔 Using session ID:', selectedConversation.sessionId);

    // Set the session ID to the old conversation's session ID
    if (selectedConversation.sessionId) {
      console.log('🔄 Setting session ID to:', selectedConversation.sessionId);
      setSessionId(selectedConversation.sessionId);
      console.log('✅ Session ID has been set');
    } else {
      console.warn('⚠️ No sessionId found in conversation!');
    }

    setIsLoading(true);
    setCurrentConversationId(id);
    setShowForm(false); // Hide form when viewing history
    setIsLoading(false);

  }, [conversations]);

  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setShowForm(true); // Show form again for new chat
    resetSessionId(); // Reset session ID for new conversation
  }, []);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  // Initial agent selection screen
  if (!selectedAgent) {
    return (
      <div className="h-screen bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100 dark:from-[#0a0e1a] dark:via-[#1a1625] dark:to-[#2d1810] text-slate-800 dark:text-slate-200 flex flex-col overflow-hidden">
        <Header onLogoClick={handleLogoClick} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-5xl w-full">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-6xl font-bold font-space-grotesk bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent mb-6">
                Welcome to Spotted Fox AI
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 font-light">
                Choose your AI assistant to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {/* Copywriting Agent */}
              <button
                onClick={() => handleSelectAgent('copywriting')}
                className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-8 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    Copywriting Agent
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Create compelling blog posts, website copy, and marketing content with advanced customization
                  </p>
                </div>
              </button>

              {/* Social Media Generator */}
              <button
                onClick={() => handleSelectAgent('social-media')}
                className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-8 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    Social Media Generator
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Generate engaging social media posts for Facebook, Instagram, Twitter, and LinkedIn
                  </p>
                </div>
              </button>

              {/* Email Writing Tool */}
              <button
                onClick={() => handleSelectAgent('email')}
                className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-8 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    Email Writing Tool
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Craft professional emails, newsletters, and email campaigns that convert
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get agent title and description based on selected agent
  const getAgentInfo = () => {
    switch (selectedAgent) {
      case 'copywriting':
        return {
          title: 'Copy Writing Agent',
          description: 'Fill the form to get started, or ask a follow-up in the chat.'
        };
      case 'social-media':
        return {
          title: 'Social Media Post Generator',
          description: 'Create engaging social media content for all platforms.'
        };
      case 'email':
        return {
          title: 'Email Writing Tool',
          description: 'Craft professional emails and newsletters that convert.'
        };
      default:
        return { title: '', description: '' };
    }
  };

  const agentInfo = getAgentInfo();

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-slate-50 to-orange-100 dark:from-[#0a0e1a] dark:via-[#1a1625] dark:to-[#2d1810] text-slate-800 dark:text-slate-200 flex flex-col overflow-hidden animate-fade-in">
      <Header
        onLogoClick={handleLogoClick}
        agentTitle={agentInfo.title}
        agentDescription={agentInfo.description}
      />
      <div className="flex flex-1 min-h-0">
        <HistorySidebar
          conversations={[...conversations].sort((a, b) => (b.timestamp || b.id) - (a.timestamp || a.id))}
          currentConversationId={currentConversation?.id ?? null}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          selectedAgent={selectedAgent}
          onSelectAgent={handleSelectAgent}
        />
        <main className="flex-1 flex flex-col p-4 lg:p-6 min-w-0">
          {selectedAgent === 'copywriting' ? (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white/80 dark:bg-gradient-to-br dark:from-[#0A101A]/80 dark:to-[#1a1625]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden min-h-0 shadow-2xl transition-all duration-500">
              <div
                className={`p-4 overflow-y-auto bg-gradient-to-b from-orange-50/50 dark:from-slate-900/20 to-transparent transition-all duration-500 ease-in-out ${showForm ? 'lg:col-span-2 opacity-100' : 'lg:col-span-0 w-0 p-0 opacity-0 overflow-hidden'
                  }`}
              >
                {showForm && (
                  <FormPanel
                    key={currentConversationId || 'new-form'}
                    onSubmit={handleFormSubmit}
                  />
                )}
              </div>
              <div
                className={`flex flex-col border-slate-200 dark:border-white/10 overflow-hidden bg-gradient-to-b from-slate-50/50 dark:from-slate-900/10 to-transparent transition-all duration-500 ease-in-out ${showForm ? 'lg:col-span-3 border-t lg:border-t-0 lg:border-l' : 'lg:col-span-5'
                  }`}
              >
                <ChatPanel
                  conversation={currentConversation}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white/80 dark:bg-gradient-to-br dark:from-[#0A101A]/80 dark:to-[#1a1625]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <ChatPanel
                conversation={currentConversation}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;