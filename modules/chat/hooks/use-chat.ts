'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/core/api/supabase/client';
import type { ChatWithCharacter } from '@/modules/chat/types/chat.types';
import { getCharacterById } from '@/modules/characters/constants/characters';

export function useChat(chatId: string) {
    const [chat, setChat] = useState<ChatWithCharacter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!chatId) {
            setError('Invalid chat ID');
            setLoading(false);
            return;
        }

        const supabase = createClient();
        let isMounted = true;
        let retryCount = 0;
        const maxRetries = 5;
        const retryDelay = 300;

        const loadChat = async () => {
            try {
                if (!isMounted) return;

                setLoading(true);
                setError(null);

                const { data, error: supabaseError } = await supabase
                    .from('chats')
                    .select('*')
                    .eq('id', chatId)
                    .single();

                if (!isMounted) return;

                if (supabaseError) {
                    // Retry on "not found" errors
                    if (supabaseError.code === 'PGRST116' && retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(() => {
                            if (isMounted) loadChat();
                        }, retryDelay * retryCount);
                        return;
                    }

                    setError(supabaseError.message || 'Failed to load chat');
                    setLoading(false);
                    return;
                }

                if (!data) {
                    setError('Chat not found');
                    setLoading(false);
                    return;
                }

                const character = getCharacterById(data.character_id);

                if (!character) {
                    setError('Character not found');
                    setLoading(false);
                    return;
                }

                setChat({
                    ...data,
                    character,
                });
                setLoading(false);
            } catch (err) {
                if (!isMounted) return;
                console.error('Error loading chat:', err);
                setError('An unexpected error occurred');
                setLoading(false);
            }
        };

        loadChat();

        return () => {
            isMounted = false;
        };
    }, [chatId]);

    return { chat, loading, error };
}