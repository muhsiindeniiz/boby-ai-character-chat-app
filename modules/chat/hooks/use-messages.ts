'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/core/api/supabase/client';
import type { Message } from '@/modules/chat/types/chat.types';

export function useMessages(chatId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('chat_id', chatId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                setMessages(data || []);
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();

        const channel = supabase
            .channel(`messages-${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === newMessage.id)) {
                            return prev;
                        }
                        return [...prev, newMessage];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId, supabase]);

    const addMessage = useCallback((message: Message) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    return { messages, loading, addMessage };
}