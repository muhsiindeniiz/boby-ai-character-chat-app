import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/core/ui/components/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Icon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mb-6 text-sm text-gray-600">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>{actionLabel}</Button>
            )}
        </motion.div>
    );
}