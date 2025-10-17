'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
        >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-purple-600"
                />
            </div>
            <div className="rounded-2xl bg-white px-4 py-2 shadow-sm">
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="h-2 w-2 rounded-full bg-gray-400"
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}