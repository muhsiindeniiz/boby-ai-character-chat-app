'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/packages/utils/cn';

export function BottomNavigation() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/chat') {
            return pathname === '/chat' || pathname.startsWith('/chat/');
        }
        return pathname === path;
    };

    const navItems = [
        {
            href: '/chat',
            icon: MessageSquare,
            label: 'Chats',
        },
        {
            href: '/characters',
            icon: Users,
            label: 'Characters',
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'relative flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors',
                                active
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                            )}
                        >
                            {active && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-lg bg-gray-100"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <Icon className="relative z-10 h-5 w-5" strokeWidth={2.5} />
                            <span className="relative z-10 text-xs font-medium">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}