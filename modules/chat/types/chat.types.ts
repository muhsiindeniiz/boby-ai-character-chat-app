import { Character } from "@/modules/characters/types/character.types";

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

export interface ChatWithCharacter extends Chat {
    character: Character | undefined;
}