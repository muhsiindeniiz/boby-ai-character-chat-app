'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/core/ui/components/button';
import { useAuth } from '@/modules/auth/hooks/use-auth';

export function SignInPage() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 text-center"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                        <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        Boby AI
                    </h1>
                    <p className="text-lg text-gray-600">
                        Harika AI karakterleriyle sohbet edin
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <Button
                        onClick={signInWithGoogle}
                        size="lg"
                        className="w-full gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google ile Devam Et
                    </Button>
                    <p className="text-xs text-gray-500">
                        Devam ederek Hizmet Şartlarımızı kabul etmiş olursunuz
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                >
                    <p className="text-sm font-medium text-gray-700">
                        Karakterlerimizle tanışın:
                    </p>
                    <div className="flex justify-center gap-2">
                        {['🌙', '⚡', '🧘', '✨', '🎭'].map((emoji, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-md"
                            >
                                {emoji}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}