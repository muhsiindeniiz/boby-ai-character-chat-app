'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/core/ui/components/card';
import { Character } from '../../types/character.types';

interface CharacterCardProps {
    character: Character;
    isSelected: boolean;
    onSelect: () => void;
}

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
    return (
        <Card
            onClick={onSelect}
            className={`cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${isSelected ? 'ring-2 ring-offset-2' : ''
                }`}
            style={{
                borderColor: `${character.color}40`,
                ...(isSelected && { '--tw-ring-color': character.color } as React.CSSProperties),
            }}
        >
            <div className="flex items-center gap-4 p-4">
                <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm"
                    style={{
                        backgroundColor: `${character.color}20`,
                    }}
                >
                    {character.avatar}
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{character.name}</h3>
                        <Sparkles className="h-4 w-4" style={{ color: character.color }} />
                    </div>
                    <p className="text-sm text-gray-600">{character.description}</p>
                    <p className="text-xs text-gray-500">{character.conversationStyle}</p>
                </div>
            </div>
        </Card>
    );
}