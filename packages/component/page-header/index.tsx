'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/core/ui/components/button';
import { useAuth } from '@/modules/auth/hooks/use-auth';

interface PageHeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
}

export function PageHeader({ title, showBack, onBack }: PageHeaderProps) {
    const router = useRouter();
    const { signOut } = useAuth();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg"
        >
            <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBack}
                            className="h-9 w-9"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <h1 className="text-lg font-semibold">{title}</h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="h-9 w-9"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </motion.header>
    );
}