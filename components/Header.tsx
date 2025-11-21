import React from 'react';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="w-full p-4 flex justify-between items-center bg-[#0A101A]/60 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
            <div className="flex items-center space-x-3">
                <img src="https://spottedfoxdigital.com/wp-content/uploads/2024/11/spotted-fox-digital.png" alt="Spotted Fox Digital Marketing Logo" className="h-12" />
            </div>
            <div className="flex items-center space-x-4">
                <button className="h-10 w-10 rounded-full bg-slate-800/50 flex items-center justify-center hover:bg-slate-700/50 transition-colors">
                    <UserIcon />
                </button>
            </div>
        </header>
    );
};