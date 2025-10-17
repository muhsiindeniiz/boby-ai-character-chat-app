'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CharacterCard } from '@/modules/characters/components/character-card';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { PageHeader } from '@/packages/component/page-header';
import { CHARACTERS } from '../../constants/characters';
import { BottomNavigation } from '@/packages/component/bottom-navigation';

export function CharactersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    const handleCharacterSelect = async (characterId: string) => {
        if (!user) return;

        setSelectedCharacter(characterId);
        sessionStorage.setItem('pendingCharacter', characterId);
        router.push('/chat');
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