// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/core/ui/components/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Bir şeyler ters gitti
                </h2>
                <p className="mb-6 text-gray-600">
                    {error.message || 'Beklenmeyen bir hata oluştu'}
                </p>
                <Button onClick={reset}>Tekrar Dene</Button>
            </div>
        </div>
    );
}   