
import React, { useRef, useEffect } from 'react';
import { Composer } from './Composer';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const ChatSkeleton: React.FC = () => (
    <div className="flex items-start space-x-3 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-white/10 shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
        </div>
    </div>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading, onSendMessage }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="bg-[#101827]/70 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl flex flex-col h-[70vh] animate-fade-in">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <ChatMessageComponent key={msg.id} message={msg} />
                ))}
                {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
                     <div className="flex w-full max-w-lg">
                        <ChatMessageComponent message={{id: -1, sender: 'assistant', text: '', status: 'loading'}}/>
                     </div>
                )}
                {isLoading && messages.length === 0 && <ChatSkeleton />}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-white/10">
                <Composer onSendMessage={onSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
};
