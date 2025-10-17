'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/core/ui/components/input';
import { Button } from '@/core/ui/components/button';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useChat } from '@/modules/chat/hooks/use-chat';
import { useMessages } from '@/modules/chat/hooks/use-messages';
import { useStreaming } from '@/modules/chat/hooks/use-streaming';
import { PageHeader } from '@/packages/component/page-header';
import { MessageSkeleton } from '@/packages/component/loading-skeleton';
import { MessageBubble } from '../../components/message-bubble';
import { TypingIndicator } from '../../components/typing-indicator';

interface ChatDetailPageProps {
    chatId: string;
}

export function ChatDetailPage({ chatId }: ChatDetailPageProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { chat, loading: chatLoading, error: chatError } = useChat(chatId);
    const { messages, loading: messagesLoading, addMessage } = useMessages(chatId);
    const {
        input,
        setInput,
        sending,
        streaming,
        displayedStreamingMessage,
        handleSend,
    } = useStreaming(chat, messages, addMessage);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, displayedStreamingMessage]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (chatLoading || messagesLoading) {
        return (
            <div className="flex h-screen flex-col" style={{ backgroundColor: '#F9FAFB' }}>
                <PageHeader title="Loading..." showBack />
                <MessageSkeleton />
            </div>
        );
    }

    if (chatError) {
        return (
            <div className="flex h-screen flex-col" style={{ backgroundColor: '#F9FAFB' }}>
                <PageHeader title="Error" showBack />
                <div className="flex flex-1 items-center justify-center p-4">
                    <div className="text-center">
                        <div
                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                            style={{ backgroundColor: '#FEE2E2' }}
                        >
                            <AlertCircle className="h-8 w-8" style={{ color: '#DC2626' }} />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold" style={{ color: '#111827' }}>
                            Failed to load chat
                        </h3>
                        <p className="mb-4 text-sm" style={{ color: '#4B5563' }}>
                            {chatError}
                        </p>
                        <Button
                            onClick={() => router.push('/chat')}
                            style={{ backgroundColor: '#9333EA', color: '#FFFFFF' }}
                        >
                            Back to Chats
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="flex h-screen flex-col" style={{ backgroundColor: '#F9FAFB' }}>
                <PageHeader title="Not Found" showBack />
                <div className="flex flex-1 items-center justify-center p-4">
                    <div className="text-center">
                        <h3 className="mb-2 text-lg font-semibold" style={{ color: '#111827' }}>
                            Chat not found
                        </h3>
                        <p className="mb-4 text-sm" style={{ color: '#4B5563' }}>
                            This chat may have been deleted.
                        </p>
                        <Button
                            onClick={() => router.push('/chat')}
                            style={{ backgroundColor: '#9333EA', color: '#FFFFFF' }}
                        >
                            Back to Chats
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col" style={{ backgroundColor: '#F9FAFB' }}>
            <PageHeader title={chat.character?.name || 'Chat'} showBack />

            <main className="flex-1 overflow-auto">
                <div className="mx-auto max-w-2xl space-y-4 p-4 pb-24">
                    <AnimatePresence initial={false}>
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                character={message.role === 'assistant' ? chat.character : undefined}
                            />
                        ))}

                        {displayedStreamingMessage && chat.character && (
                            <MessageBubble
                                message={{
                                    id: 'streaming',
                                    chat_id: chat.id,
                                    content: displayedStreamingMessage,
                                    role: 'assistant',
                                    created_at: new Date().toISOString(),
                                }}
                                character={chat.character}
                                isStreaming={true}
                            />
                        )}

                        {sending && <TypingIndicator />}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)' }}>
                <div className="mx-auto flex max-w-lg items-end gap-2 p-4">
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Message ${chat.character?.name || ''}...`}
                        disabled={sending || streaming}
                        className="min-h-[44px] resize-none rounded-full"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || sending || streaming}
                        size="icon"
                        className="h-11 w-11 shrink-0 rounded-full"
                    >
                        {sending || streaming ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}