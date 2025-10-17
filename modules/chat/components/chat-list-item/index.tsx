'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, Loader2 } from 'lucide-react';
import { Card } from '@/core/ui/components/card';
import { Button } from '@/core/ui/components/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/core/ui/components/alert-dialog';
import { formatDate } from '@/packages/utils/format-date';
import type { Chat } from '@/modules/chat/types/chat.types';
import { getCharacterById } from '@/modules/characters/constants/characters';

interface ChatListItemProps {
    chat: Chat;
    index: number;
    onDelete: (chatId: string) => Promise<void>;
    onClick: () => void;
    isDeleting?: boolean;
}

export function ChatListItem({
    chat,
    index,
    onDelete,
    onClick,
    isDeleting = false
}: ChatListItemProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const character = getCharacterById(chat.character_id);

    if (!character) return null;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteDialog(false);
        await onDelete(chat.id);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Card
                    onClick={onClick}
                    className={`group cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''
                        }`}
                >
                    <div className="flex items-center gap-4 p-4">
                        <div
                            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-2xl shadow-sm"
                            style={{
                                backgroundColor: `${character.color}20`,
                            }}
                        >
                            {character.avatar}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{character.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        {formatDate(chat.updated_at)}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <p className="truncate text-sm text-gray-600">{chat.title}</p>
                        </div>
                    </div>
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{
                            background: `linear-gradient(90deg, ${character.color}40, ${character.color}20)`,
                        }}
                    />
                </Card>
            </motion.div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this chat with {character.name}?
                            This action cannot be undone and all messages will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}