import type { ChatMessage } from './client';

/**
 * Prepare messages for Groq API
 * Ensures system prompt is first and formats messages correctly
 */
export function prepareMessages(
    messages: ChatMessage[],
    systemPrompt?: string
): ChatMessage[] {
    const preparedMessages: ChatMessage[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
        preparedMessages.push({
            role: 'system',
            content: systemPrompt,
        });
    }

    // Add user and assistant messages
    for (const message of messages) {
        if (message.role !== 'system') {
            preparedMessages.push(message);
        }
    }

    return preparedMessages;
}

/**
 * Truncate message history to fit within token limits
 * Keeps system message and most recent messages
 */
export function truncateMessages(
    messages: ChatMessage[],
    maxMessages: number = 20
): ChatMessage[] {
    if (messages.length <= maxMessages) {
        return messages;
    }

    const systemMessages = messages.filter((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    // Keep most recent messages
    const recentMessages = conversationMessages.slice(
        -maxMessages + systemMessages.length
    );

    return [...systemMessages, ...recentMessages];
}

/**
 * Estimate token count (rough approximation)
 * More accurate counting would require tokenizer library
 */
export function estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

/**
 * Calculate total tokens in message history
 */
export function calculateTotalTokens(messages: ChatMessage[]): number {
    return messages.reduce((total, message) => {
        return total + estimateTokenCount(message.content);
    }, 0);
}

/**
 * Format error message for user display
 */
export function formatGroqError(error: unknown): string {
    if (error instanceof Error) {
        // Check for common Groq API errors
        if (error.message.includes('rate_limit')) {
            return 'Too many requests. Please wait a moment and try again.';
        }
        if (error.message.includes('invalid_api_key')) {
            return 'API configuration error. Please contact support.';
        }
        if (error.message.includes('model_not_found')) {
            return 'The AI model is temporarily unavailable. Please try again.';
        }
        if (error.message.includes('context_length_exceeded')) {
            return 'Message history is too long. Please start a new conversation.';
        }

        return 'An error occurred while processing your request.';
    }

    return 'An unexpected error occurred.';
}

/**
 * Retry logic for API calls
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');

            // Don't retry on certain errors
            if (
                lastError.message.includes('invalid_api_key') ||
                lastError.message.includes('context_length_exceeded')
            ) {
                throw lastError;
            }

            // Wait before retrying (exponential backoff)
            if (i < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, i);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError!;
}