'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { CharacterCard } from '@/modules/characters/components/character-card';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { PageHeader } from '@/packages/component/page-header';
import { CHARACTERS } from '../../constants/characters';
import { BottomNavigation } from '@/packages/component/bottom-navigation';
import { createClient } from '@/core/api/supabase/client';
import { getCharacterById } from '../../constants/characters';

export function CharactersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleCharacterSelect = async (characterId: string) => {
        if (!user || isCreating) return;

        setSelectedCharacter(characterId);
        setIsCreating(true);

        const supabase = createClient();

        try {
            const character = getCharacterById(characterId);
            if (!character) {
                console.error('Character not found:', characterId);
                return;
            }

            // Create the chat
            const { data: chat, error } = await supabase
                .from('chats')
                .insert({
                    user_id: user.id,
                    character_id: characterId,
                    title: `Chat with ${character.name}`,
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating chat:', error);
                throw error;
            }

            // Verify chat creation
            const { data: verifiedChat, error: verifyError } = await supabase
                .from('chats')
                .select('*')
                .eq('id', chat.id)
                .single();

            if (verifyError || !verifiedChat) {
                throw new Error('Failed to verify chat creation');
            }

            // Navigate to the chat
            router.push(`/chat/${chat.id}`);
        } catch (error) {
            console.error('Error creating chat:', error);
            alert('Failed to create chat. Please try again.');
            setIsCreating(false);
            setSelectedCharacter(null);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <PageHeader title="Characters" />

            <main className="flex-1 overflow-auto pb-20">
                <div className="mx-auto max-w-lg p-4">
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-6 text-center"
                    >
                        <h2 className="text-2xl font-bold text-gray-900">
                            Choose Your Character
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Select a character to start a new conversation
                        </p>
                    </motion.div>

                    {isCreating && (
                        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-purple-50 p-4">
                            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                            <p className="text-sm font-medium text-purple-900">
                                Creating your chat...
                            </p>
                        </div>
                    )}

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-3"
                    >
                        {CHARACTERS.map((character) => (
                            <motion.div key={character.id} variants={item}>
                                <CharacterCard
                                    character={character}
                                    isSelected={selectedCharacter === character.id}
                                    onSelect={() => handleCharacterSelect(character.id)}
                                    disabled={isCreating}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}