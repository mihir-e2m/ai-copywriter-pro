import React, { useRef, useEffect } from 'react';
import { Composer } from './Composer';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import type { Conversation } from '../types';

interface ChatPanelProps {
    conversation: Conversation | undefined;
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

const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.5 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.5 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);


export const ChatPanel: React.FC<ChatPanelProps> = ({ conversation, isLoading, onSendMessage }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messages = conversation?.messages ?? [];
    const currentConversationId = conversation?.id ?? null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const isGeneratingFirstMessage = isLoading && messages.length === 0 && !!currentConversationId;

    return (
        <div className="flex flex-col flex-1 min-w-0 h-full">
            <div className="flex-1 overflow-y-auto flex flex-col">
                {!currentConversationId && !isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-8">
                        <SparklesIcon />
                        <h2 className="mt-4 text-xl font-bold text-slate-200 font-space-grotesk">Start Creating</h2>
                        <p className="mt-2 max-w-xs">
                            Fill out the form on the left to generate your first piece of copy, or just start chatting below.
                        </p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6 flex-1">
                        {messages.map((msg) => (
                            <ChatMessageComponent key={msg.id} message={msg} />
                        ))}

                        {isGeneratingFirstMessage && <ChatSkeleton />}

                        {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                            <div className="flex w-full max-w-lg">
                                <ChatMessageComponent message={{ id: -1, sender: 'assistant', text: '', status: 'loading' }} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-white/10">
                <Composer onSendMessage={onSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
};