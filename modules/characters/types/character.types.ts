export interface Character {
    id: string;
    name: string;
    avatar: string;
    description: string;
    conversationStyle: string;
    systemPrompt: string;
    color: string;
}

export interface Message {
    id: string;
    chat_id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
}

export interface Chat {
    id: string;
    user_id: string;
    character_id: string;
    title: string;
    created_at: string;
    updated_at: string;
}