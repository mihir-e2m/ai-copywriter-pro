import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type AgentType = 'copywriting' | 'social-media' | 'email';

interface HeaderProps {
    selectedAgent?: AgentType | null;
    onSelectAgent?: (agent: AgentType) => void;
    onLogoClick?: () => void;
    agentTitle?: string;
    agentDescription?: string;
    userEmail?: string;
    onLogout?: () => void;
}

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
                className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg border border-orange-300 dark:border-orange-500/40 shadow-md hover:shadow-lg hover:border-orange-400 dark:hover:border-orange-500/60 transition-all duration-200"
            >
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
                    {selectedAgentData?.icon}
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
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
                <div className="absolute top-full mt-2 left-0 w-full min-w-[260px] bg-white dark:bg-slate-900 backdrop-blur-xl rounded-lg border border-orange-300 dark:border-orange-500/40 shadow-2xl overflow-hidden animate-fade-in z-50">
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

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const UserProfileDropdown: React.FC<{ userEmail: string; onLogout: () => void }> = ({ userEmail, onLogout }) => {
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

    // Get initials from email
    const getInitials = (email: string) => {
        const name = email.split('@')[0];
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-white dark:border-slate-800"
            >
                {getInitials(userEmail)}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-900 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-fade-in z-50">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                                {getInitials(userEmail)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Signed in as</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="p-2">
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 font-medium text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ selectedAgent, onSelectAgent, onLogoClick, agentTitle, agentDescription, userEmail, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="w-full px-6 py-4 flex items-center bg-gradient-to-r from-slate-50/80 via-orange-50/80 to-slate-50/80 dark:from-[#0A101A]/80 dark:via-[#1a1625]/80 dark:to-[#0A101A]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 shadow-lg">
            <button
                onClick={onLogoClick}
                className="transition-all duration-300 hover:scale-105 active:scale-95"
            >
                <img 
                    src="https://spottedfoxdigital.com/wp-content/uploads/2024/11/spotted-fox-digital.png" 
                    alt="Spotted Fox Digital Marketing Logo" 
                    className="h-14 drop-shadow-lg transition-all duration-300"
                    style={{ 
                        filter: theme === 'light' 
                            ? 'brightness(0) saturate(100%) invert(55%) sepia(89%) saturate(1726%) hue-rotate(360deg) brightness(102%) contrast(101%)' 
                            : 'none' 
                    }}
                />
            </button>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                {agentTitle && (
                    <>
                        <h1 className="text-2xl font-bold font-space-grotesk bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                            {agentTitle}
                        </h1>
                        {agentDescription && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {agentDescription}
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={toggleTheme}
                    className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-slate-800/50 dark:to-slate-900/50 flex items-center justify-center hover:from-orange-200 hover:to-orange-300 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-200 border border-orange-300 dark:border-white/10 shadow-md transform hover:scale-110 active:scale-95 text-orange-600 dark:text-orange-400"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                {userEmail && onLogout && (
                    <UserProfileDropdown userEmail={userEmail} onLogout={onLogout} />
                )}
            </div>
        </header>
    );
};