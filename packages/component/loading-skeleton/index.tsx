import React from 'react';
import { motion } from 'framer-motion';

export function MessageSkeleton() {
    return (
        <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`w-full max-w-[85%] space-y-3 rounded-2xl px-4 py-3 ${i % 2 === 0 ? 'bg-[#F4F4F4]' : 'bg-white shadow-sm'
                            }`}
                    >
                        <div className="h-3 w-20 animate-pulse rounded" style={{ backgroundColor: '#D1D5DB' }} />
                        <div className="h-3 w-full animate-pulse rounded" style={{ backgroundColor: '#D1D5DB' }} />
                        <div className="h-3 w-4/5 animate-pulse rounded" style={{ backgroundColor: '#D1D5DB' }} />
                        <div className="h-3 w-3/5 animate-pulse rounded" style={{ backgroundColor: '#D1D5DB' }} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}