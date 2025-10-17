'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/core/api/supabase/client';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import type { Chat } from '@/modules/chat/types/chat.types';
import { getCharacterById } from '@/modules/characters/constants/characters';

export function useChatList() {
    const { user } = useAuth();
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const loadChats = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        const supabase = createClient();

        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Filter out chats with no messages
            const chatsWithMessages: Chat[] = [];

            for (const chat of data || []) {
                const { count } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('chat_id', chat.id);

                if (count && count > 0) {
                    chatsWithMessages.push(chat as Chat);
                } else {
                    // Delete empty chats silently
                    await supabase.from('chats').delete().eq('id', chat.id);
                }
            }

            setChats(chatsWithMessages);
        } catch (error) {
            console.error('Error loading chats:', error);
            setChats([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const createNewChat = useCallback(
        async (characterId: string) => {
            if (!user || creating) return null;

            setCreating(true);
            const supabase = createClient();

            try {
                const character = getCharacterById(characterId);
                if (!character) {
                    console.error('Character not found:', characterId);
                    return null;
                }

                const { data: chat, error } = await supabase
                    .from('chats')
                    .insert({
                        user_id: user.id,
                        character_id: characterId,
                        title: `Chat with ${character.name}`,
                    })
                    .select()
                    .single();

                if (error) {
                    console.error('Error creating chat:', error);
                    throw error;
                }

                // Verify chat was created by fetching it
                const { data: verifiedChat, error: verifyError } = await supabase
                    .from('chats')
                    .select('*')
                    .eq('id', chat.id)
                    .single();

                if (verifyError || !verifiedChat) {
                    throw new Error('Failed to verify chat creation');
                }

                return verifiedChat.id;
            } catch (error) {
                console.error('Error creating chat:', error);
                alert('Failed to create chat. Please try again.');
                return null;
            } finally {
                setCreating(false);
            }
        },
        [user, creating]
    );

    const deleteChat = useCallback(
        async (chatId: string) => {
            setDeletingId(chatId);

            const supabase = createClient();

            try {
                // Delete messages first (foreign key constraint)
                const { error: messagesError } = await supabase
                    .from('messages')
                    .delete()
                    .eq('chat_id', chatId);

                if (messagesError) throw messagesError;

                // Then delete chat
                const { error: chatError } = await supabase
                    .from('chats')
                    .delete()
                    .eq('id', chatId);

                if (chatError) throw chatError;

                // Update local state
                setChats((prev) => prev.filter((chat) => chat.id !== chatId));
            } catch (error) {
                console.error('Error deleting chat:', error);
                alert('Failed to delete chat. Please try again.');
            } finally {
                setDeletingId(null);
            }
        },
        []
    );

    // Initial load
    useEffect(() => {
        if (user) {
            loadChats();
        } else {
            setLoading(false);
        }
    }, [user, loadChats]);

    return {
        chats,
        loading,
        deletingId,
        creating,
        deleteChat,
        loadChats,
        createNewChat,
    };
}