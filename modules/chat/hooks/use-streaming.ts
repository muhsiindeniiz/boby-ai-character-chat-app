'use client';

import { useState, useEffect, useRef } from 'react';
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

    const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (streamingMessage === displayedStreamingMessage) return;

        if (streamingTimeoutRef.current) {
            clearTimeout(streamingTimeoutRef.current);
        }

        if (displayedStreamingMessage.length < streamingMessage.length) {
            streamingTimeoutRef.current = setTimeout(() => {
                setDisplayedStreamingMessage(
                    streamingMessage.slice(0, displayedStreamingMessage.length + 1)
                );
            }, 20);
        }

        return () => {
            if (streamingTimeoutRef.current) {
                clearTimeout(streamingTimeoutRef.current);
            }
        };
    }, [streamingMessage, displayedStreamingMessage]);

    const handleSend = async () => {
        if (!input.trim() || !chat || sending || streaming) return;

        const userMessage = input.trim();
        setInput('');
        setSending(true);

        try {
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

            await supabase
                .from('chats')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', chat.id);

            setSending(false);
            setStreaming(true);
            setStreamingMessage('');
            setDisplayedStreamingMessage('');

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
                        if (fullResponse) {
                            await saveMessage(fullResponse);
                        }
                        return;
                    }
                    throw error;
                }
            }

            const maxWaitTime = 10000;
            const startTime = Date.now();

            await new Promise<void>((resolve) => {
                const checkComplete = () => {
                    if (
                        displayedStreamingMessage === fullResponse ||
                        Date.now() - startTime > maxWaitTime
                    ) {
                        resolve();
                    } else {
                        setTimeout(checkComplete, 50);
                    }
                };
                checkComplete();
            });

            await saveMessage(fullResponse);

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
        } finally {
            setSending(false);
            abortControllerRef.current = null;
        }
    };

    const saveMessage = async (content: string) => {
        if (!chat || !content) return;

        try {
            await supabase.from('messages').insert({
                chat_id: chat.id,
                content: content,
                role: 'assistant',
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

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