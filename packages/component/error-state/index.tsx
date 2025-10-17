import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/core/ui/components/button';

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Something went wrong',
    message,
    onRetry,
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mb-6 text-sm text-gray-600">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline">
                    Try Again
                </Button>
            )}
        </motion.div>
    );
}