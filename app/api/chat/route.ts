import { NextRequest } from 'next/server';
import { streamChatCompletion } from '@/core/api/groq/client';
import {
    prepareMessages,
    formatGroqError,
    retryWithBackoff,
} from '@/core/api/groq/utils';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const { messages, systemPrompt } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response('Invalid messages format', { status: 400 });
        }

        if (!systemPrompt || typeof systemPrompt !== 'string') {
            return new Response('Invalid system prompt', { status: 400 });
        }

        const preparedMessages = prepareMessages(messages, systemPrompt);

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    await retryWithBackoff(async () => {
                        for await (const chunk of streamChatCompletion(preparedMessages)) {
                            controller.enqueue(encoder.encode(chunk));
                        }
                    });

                    controller.close();
                } catch (error) {
                    console.error('Chat API error:', error);
                    const errorMessage = formatGroqError(error);
                    controller.enqueue(encoder.encode(`\n\nError: ${errorMessage}`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache, no-transform',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}