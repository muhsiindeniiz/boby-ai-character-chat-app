'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/core/ui/components/button';
import { ChatListItem } from '@/modules/chat/components/chat-list-item';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useChatList } from '@/modules/chat/hooks/use-chat-list';
import { BottomNavigation } from '@/packages/component/bottom-navigation';
import { PageHeader } from '@/packages/component/page-header';

export function ChatListPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const {
        chats,
        loading,
        deletingId,
        deleteChat,
        checkPendingCharacter
    } = useChatList();

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/auth/sign-in');
            return;
        }

        if (user) {
            checkPendingCharacter();
        }
    }, [user, authLoading, router, checkPendingCharacter]);

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#F9FAFB' }}>
                <PageHeader title="Chats" />
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <div
                            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full"
                            style={{
                                border: '4px solid #E5E7EB',
                                borderTopColor: '#9333EA'
                            }}
                        />
                        <p className="text-sm" style={{ color: '#4B5563' }}>Loading...</p>
                    </div>
                </div>
                <BottomNavigation />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#F9FAFB' }}>
            <PageHeader title="Chats" />

            <main className="flex-1 overflow-auto pb-20">
                <div className="mx-auto max-w-lg p-4">
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-4"
                    >
                        <Button
                            onClick={() => router.push('/characters')}
                            className="w-full gap-2 text-white shadow-lg"
                            style={{
                                background: 'linear-gradient(to right, #9333EA, #2563EB)'
                            }}
                            size="lg"
                        >
                            <Plus className="h-5 w-5" />
                            New Chat
                        </Button>
                    </motion.div>

                    {chats.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <div
                                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                                style={{ backgroundColor: '#F3E8FF' }}
                            >
                                <MessageCircle className="h-10 w-10" style={{ color: '#9333EA' }} />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold" style={{ color: '#111827' }}>
                                No chats yet
                            </h3>
                            <p className="mb-6 text-sm" style={{ color: '#4B5563' }}>
                                Start a conversation by selecting a character
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3"
                        >
                            {chats.map((chat, index) => (
                                <ChatListItem
                                    key={chat.id}
                                    chat={chat}
                                    index={index}
                                    onDelete={deleteChat}
                                    onClick={() => router.push(`/chat/${chat.id}`)}
                                    isDeleting={deletingId === chat.id}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}