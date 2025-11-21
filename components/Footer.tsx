
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center p-4 mt-8">
            <div className="text-xs text-slate-400">
                <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
                <span className="mx-2">|</span>
                <span>v1.0.0</span>
            </div>
        </footer>
    );
};
