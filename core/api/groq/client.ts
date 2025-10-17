import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Types
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export type GroqModel =
    | 'llama-3.3-70b-versatile'
    | 'llama-3.1-70b-versatile'
    | 'llama-3.1-8b-instant'
    | 'mixtral-8x7b-32768'
    | 'gemma2-9b-it'
    | 'gemma-7b-it';

export interface GroqChatOptions {
    model?: GroqModel;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stop?: string | string[] | null;
    stream?: boolean;
}

export interface StreamChunk {
    content: string;
    role?: 'assistant';
    finishReason?: 'stop' | 'length' | null;
}

export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

// Main functions
export async function* streamChatCompletion(
    messages: ChatMessage[],
    model: GroqModel = 'llama-3.3-70b-versatile'
) {
    try {
        const stream = await groq.chat.completions.create({
            messages,
            model,
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stop: null,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    } catch (error) {
        console.error('Groq streaming error:', error);
        throw new Error('Failed to stream chat completion');
    }
}

export async function getChatCompletion(
    messages: ChatMessage[],
    model: GroqModel = 'llama-3.3-70b-versatile'
): Promise<string> {
    try {
        const completion = await groq.chat.completions.create({
            messages,
            model,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Groq completion error:', error);
        throw new Error('Failed to get chat completion');
    }
}

export async function listAvailableModels() {
    try {
        const models = await groq.models.list();
        return models.data;
    } catch (error) {
        console.error('Error listing models:', error);
        throw new Error('Failed to list models');
    }
}

// Class-based client
export class GroqClient {
    private model: GroqModel;
    private temperature: number;
    private maxTokens: number;

    constructor(options?: Partial<GroqChatOptions>) {
        this.model = options?.model || 'llama-3.3-70b-versatile';
        this.temperature = options?.temperature || 0.7;
        this.maxTokens = options?.maxTokens || 1024;
    }

    async *streamCompletion(
        messages: ChatMessage[],
        options?: Partial<GroqChatOptions>
    ) {
        try {
            const stream = await groq.chat.completions.create({
                messages,
                model: options?.model || this.model,
                stream: true,
                temperature: options?.temperature || this.temperature,
                max_tokens: options?.maxTokens || this.maxTokens,
                top_p: options?.topP || 1,
                stop: options?.stop || null,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                const finishReason = chunk.choices[0]?.finish_reason;

                if (content) {
                    yield {
                        content,
                        role: 'assistant' as const,
                        finishReason: finishReason as 'stop' | 'length' | null,
                    };
                }

                if (finishReason) {
                    break;
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Groq streaming failed: ${error.message}`);
            }
            throw new Error('Groq streaming failed with unknown error');
        }
    }

    async getCompletion(
        messages: ChatMessage[],
        options?: Partial<GroqChatOptions>
    ): Promise<string> {
        try {
            const completion = await groq.chat.completions.create({
                messages,
                model: options?.model || this.model,
                temperature: options?.temperature || this.temperature,
                max_tokens: options?.maxTokens || this.maxTokens,
                top_p: options?.topP || 1,
                stop: options?.stop || null,
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Groq completion failed: ${error.message}`);
            }
            throw new Error('Groq completion failed with unknown error');
        }
    }

    async listModels() {
        try {
            const models = await groq.models.list();
            return models.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to list models: ${error.message}`);
            }
            throw new Error('Failed to list models');
        }
    }

    setModel(model: GroqModel) {
        this.model = model;
    }

    setTemperature(temperature: number) {
        if (temperature < 0 || temperature > 2) {
            throw new Error('Temperature must be between 0 and 2');
        }
        this.temperature = temperature;
    }

    setMaxTokens(maxTokens: number) {
        if (maxTokens < 1) {
            throw new Error('Max tokens must be at least 1');
        }
        this.maxTokens = maxTokens;
    }
}

// Export singleton instance
export const groqClient = new GroqClient();