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
        const supabase = createClient();
        let retryCount = 0;
        const maxRetries = 3;

        const loadChat = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error: supabaseError } = await supabase
                    .from('chats')
                    .select('*')
                    .eq('id', chatId)
                    .single();

                if (supabaseError) {
                    // If chat not found and we haven't exceeded retries, try again
                    if (supabaseError.code === 'PGRST116' && retryCount < maxRetries) {
                        retryCount++;
                        console.log(`Chat not found, retrying... (${retryCount}/${maxRetries})`);
                        setTimeout(loadChat, 500 * retryCount); // Exponential backoff
                        return;
                    }

                    console.error('Supabase error:', supabaseError);
                    setError(supabaseError.message || 'Failed to load chat');
                    setLoading(false);
                    return;
                }

                if (!data) {
                    console.error('No chat found with id:', chatId);
                    setError('Chat not found');
                    setLoading(false);
                    return;
                }

                const character = getCharacterById(data.character_id);

                if (!character) {
                    console.error('Character not found with id:', data.character_id);
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
                console.error('Error loading chat:', err);
                setError('An unexpected error occurred');
                setLoading(false);
            }
        };

        if (chatId) {
            loadChat();
        } else {
            setError('Invalid chat ID');
            setLoading(false);
        }
    }, [chatId]);

    return { chat, loading, error };
}