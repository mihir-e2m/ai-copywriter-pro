import React, { useState, useRef, useEffect } from 'react';
import type { Conversation } from '../types';

type AgentType = 'copywriting' | 'social-media' | 'email';

interface HistorySidebarProps {
  conversations: Conversation[];
  currentConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
  selectedAgent: AgentType;
  onSelectAgent: (agent: AgentType) => void;
}

const NewChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

interface CustomDropdownProps {
    selectedAgent: AgentType;
    onSelectAgent: (agent: AgentType) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ selectedAgent, onSelectAgent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const agents = [
        {
            type: 'copywriting' as AgentType,
            label: 'Copywriting Agent',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        {
            type: 'social-media' as AgentType,
            label: 'Social Media Generator',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            )
        },
        {
            type: 'email' as AgentType,
            label: 'Email Writing Tool',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    const selectedAgentData = agents.find(a => a.type === selectedAgent);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg border border-orange-300 dark:border-orange-500/40 shadow-md hover:shadow-lg hover:border-orange-400 dark:hover:border-orange-500/60 transition-all duration-200"
            >
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
                    {selectedAgentData?.icon}
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex-1 text-left">
                    {selectedAgentData?.label}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-orange-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 backdrop-blur-xl rounded-lg border border-orange-300 dark:border-orange-500/40 shadow-2xl overflow-hidden animate-fade-in z-50">
                    {agents.map((agent) => (
                        <button
                            key={agent.type}
                            onClick={() => {
                                onSelectAgent(agent.type);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-all duration-150 ${
                                selectedAgent === agent.type
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                                selectedAgent === agent.type
                                    ? 'bg-white/20'
                                    : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                            }`}>
                                {agent.icon}
                            </div>
                            <span className="font-medium text-sm">{agent.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ conversations, currentConversationId, onSelectConversation, onNewChat, selectedAgent, onSelectAgent }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-100/80 to-white/80 dark:from-black/20 dark:to-black/10 backdrop-blur-sm flex flex-col shrink-0 border-r border-slate-200 dark:border-white/10">
      <div className="p-4 space-y-3 border-b border-slate-200 dark:border-white/10">
        <CustomDropdown selectedAgent={selectedAgent} onSelectAgent={onSelectAgent} />
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-orange-700 dark:text-white bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 border border-orange-300 dark:border-orange-500/30 rounded-xl hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-500/30 dark:hover:to-orange-600/30 hover:border-orange-400 dark:hover:border-orange-500/50 transition-all duration-200 shadow-sm transform hover:scale-105 active:scale-95"
        >
          <NewChatIcon />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="px-4 pt-4 pb-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">History</h2>
        <nav className="p-2">
          {conversations.map((convo) => (
            <div key={convo.id} className="relative mb-1">
              {convo.id === currentConversationId && (
                <div className="absolute inset-y-1 left-0 w-1 bg-gradient-to-b from-orange-500 to-orange-700 rounded-r-full shadow-lg" />
              )}
              <button
                onClick={() => onSelectConversation(convo.id)}
                className={`w-full text-left block truncate pl-6 pr-3 py-3 text-sm rounded-xl transition-all duration-200 ${
                  convo.id === currentConversationId
                    ? 'text-orange-700 dark:text-white font-bold bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {convo.title}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};