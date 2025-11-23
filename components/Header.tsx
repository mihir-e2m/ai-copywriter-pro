import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

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

export const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-slate-50/80 via-orange-50/80 to-slate-50/80 dark:from-[#0A101A]/80 dark:via-[#1a1625]/80 dark:to-[#0A101A]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 shadow-lg">
            <div className="flex items-center space-x-3">
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
            </div>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={toggleTheme}
                    className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-slate-800/50 dark:to-slate-900/50 flex items-center justify-center hover:from-orange-200 hover:to-orange-300 dark:hover:from-slate-700/50 dark:hover:to-slate-800/50 transition-all duration-200 border border-orange-300 dark:border-white/10 shadow-md transform hover:scale-110 active:scale-95 text-orange-600 dark:text-orange-400"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </header>
    );
};