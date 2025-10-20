'use client';

import React, { createContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/core/api/supabase/client';
import { AuthContextType } from '../utils/auth.utils';

export const AuthContext = createContext<AuthContextType | null>(null);

function LoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        
        const initAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error) {
            console.error('Sign in error:', error);
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    if (!mounted || loading) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading: false,
                signInWithGoogle,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}