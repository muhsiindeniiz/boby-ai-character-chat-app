'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/core/api/supabase/client';
import type { ChatWithCharacter, Message } from '@/modules/chat/types/chat.types';

export function useStreaming(
    chat: ChatWithCharacter | null,
    messages: Message[],
    addMessage: (message: Message) => void
) {
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [displayedStreamingMessage, setDisplayedStreamingMessage] = useState('');

    const abortControllerRef = useRef<AbortController | null>(null);
    const isSavingRef = useRef(false);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const supabase = createClient();

    // Typing effect - karakter karakter yazdırma
    useEffect(() => {
        // Eğer gösterilen mesaj tam mesaja ulaştıysa, durma
        if (displayedStreamingMessage === streamingMessage) {
            return;
        }

        // Eğer gösterilen mesaj tam mesajdan kısaysa, devam et
        if (displayedStreamingMessage.length < streamingMessage.length) {
            if (typingIntervalRef.current) {
                clearTimeout(typingIntervalRef.current);
            }

            typingIntervalRef.current = setTimeout(() => {
                setDisplayedStreamingMessage(
                    streamingMessage.slice(0, displayedStreamingMessage.length + 1)
                );
            }, 15); // Hız ayarı (ms)
        }

        return () => {
            if (typingIntervalRef.current) {
                clearTimeout(typingIntervalRef.current);
            }
        };
    }, [streamingMessage, displayedStreamingMessage]);

    const saveMessage = useCallback(
        async (content: string) => {
            if (!chat || !content || isSavingRef.current) return null;

            isSavingRef.current = true;

            try {
                const { data, error } = await supabase
                    .from('messages')
                    .insert({
                        chat_id: chat.id,
                        content: content,
                        role: 'assistant',
                    })
                    .select()
                    .single();

                if (error) throw error;

                return data;
            } catch (error) {
                console.error('Error saving message:', error);
                return null;
            } finally {
                isSavingRef.current = false;
            }
        },
        [chat, supabase]
    );

    const handleSend = async () => {
        if (!input.trim() || !chat || sending || streaming) return;

        const userMessage = input.trim();
        setInput('');
        setSending(true);

        try {
            // 1. Kullanıcı mesajını kaydet
            const { data: savedUserMessage, error: userError } = await supabase
                .from('messages')
                .insert({
                    chat_id: chat.id,
                    content: userMessage,
                    role: 'user',
                })
                .select()
                .single();

            if (userError) throw userError;

            addMessage(savedUserMessage);

            // 2. Chat timestamp'ini güncelle
            await supabase
                .from('chats')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', chat.id);

            // 3. AI'dan yanıt almaya başla
            if (!chat.character) throw new Error('Character not found');

            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        ...messages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                        { role: 'user', content: userMessage },
                    ],
                    systemPrompt: chat.character.systemPrompt,
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) throw new Error('Failed to get response');

            // 4. Sending'i kapat, streaming'i aç
            setSending(false);
            setStreaming(true);
            setStreamingMessage('');
            setDisplayedStreamingMessage('');

            // 5. Stream'i oku
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            if (reader) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        fullResponse += chunk;
                        setStreamingMessage(fullResponse);
                    }
                } catch (error: any) {
                    if (error.name === 'AbortError') {
                        console.log('Stream aborted');
                        return;
                    }
                    throw error;
                }
            }

            // 6. Typing effect'in bitmesini bekle
            await new Promise<void>((resolve) => {
                const checkInterval = setInterval(() => {
                    if (displayedStreamingMessage.length >= fullResponse.length) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);

                // Maksimum 15 saniye bekle
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve();
                }, 15000);
            });

            // 7. Mesajı kaydet
            const savedMessage = await saveMessage(fullResponse);
            if (savedMessage) {
                addMessage(savedMessage);
            }

            // 8. State'leri temizle
            setStreamingMessage('');
            setDisplayedStreamingMessage('');
            setStreaming(false);
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Error sending message:', error);
            }
            setStreaming(false);
            setStreamingMessage('');
            setDisplayedStreamingMessage('');
            setSending(false);
        } finally {
            setSending(false);
            abortControllerRef.current = null;
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearTimeout(typingIntervalRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        input,
        setInput,
        sending,
        streaming,
        streamingMessage,
        displayedStreamingMessage,
        handleSend,
    };
}