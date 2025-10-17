'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '@/modules/chat/types/chat.types';
import { Character } from '@/modules/characters/types/character.types';

interface MessageBubbleProps {
    message: Message;
    character?: Character;
    isStreaming?: boolean;
}

export function MessageBubble({ message, character, isStreaming = false }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div>
                    {!isUser && character && (
                        <div
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl"
                            style={{ backgroundColor: `${character.color}20` }}
                        >
                            {character.avatar}
                        </div>
                    )}
                </div>

                <div
                    className={`rounded-2xl px-4 py-3 ${isUser
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                        }`}
                >
                    {isUser ? (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm max-w-none prose-p:my-2 prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-headings:mt-4 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
                            <div className="inline">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => (
                                            <p className="text-sm text-gray-900 leading-relaxed inline">
                                                {children}
                                            </p>
                                        ),
                                        code: ({ inline, className, children, ...props }: any) => {
                                            if (inline) {
                                                return (
                                                    <code
                                                        className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-xs font-mono"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            }
                                            return (
                                                <code
                                                    className={`block bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono ${className || ''
                                                        }`}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        pre: ({ children }) => (
                                            <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto my-2">
                                                {children}
                                            </pre>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                                {children}
                                            </ol>
                                        ),
                                        li: ({ children }) => (
                                            <li className="text-gray-900 text-sm">{children}</li>
                                        ),
                                        strong: ({ children }) => (
                                            <strong className="font-semibold text-gray-900">
                                                {children}
                                            </strong>
                                        ),
                                        em: ({ children }) => (
                                            <em className="italic text-gray-800">{children}</em>
                                        ),
                                        h1: ({ children }) => (
                                            <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({ children }) => (
                                            <h2 className="text-lg font-bold text-gray-900 mt-3 mb-2">
                                                {children}
                                            </h2>
                                        ),
                                        h3: ({ children }) => (
                                            <h3 className="text-base font-semibold text-gray-900 mt-3 mb-1">
                                                {children}
                                            </h3>
                                        ),
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-700 my-2">
                                                {children}
                                            </blockquote>
                                        ),
                                        a: ({ children, href }) => (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:text-purple-700 underline"
                                            >
                                                {children}
                                            </a>
                                        ),
                                        table: ({ children }) => (
                                            <div className="overflow-x-auto my-2">
                                                <table className="min-w-full border-collapse border border-gray-300">
                                                    {children}
                                                </table>
                                            </div>
                                        ),
                                        th: ({ children }) => (
                                            <th className="border border-gray-300 px-3 py-2 bg-gray-100 text-left font-semibold text-sm">
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children }) => (
                                            <td className="border border-gray-300 px-3 py-2 text-sm">
                                                {children}
                                            </td>
                                        ),
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                                {isStreaming && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="ml-0.5 inline-block text-purple-600 font-bold"
                                    >
                                        ▋
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}