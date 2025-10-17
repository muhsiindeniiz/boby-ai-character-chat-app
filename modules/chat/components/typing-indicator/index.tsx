'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Character } from '@/modules/characters/types/character.types';

interface TypingIndicatorProps {
    character?: Character;
}

export function TypingIndicator({ character }: TypingIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-3"
        >
            {character && (
                <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl"
                    style={{ backgroundColor: `${character.color}20` }}
                >
                    {character.avatar}
                </div>
            )}
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: 'easeInOut',
                            }}
                            className="h-2 w-2 rounded-full bg-purple-500"
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}