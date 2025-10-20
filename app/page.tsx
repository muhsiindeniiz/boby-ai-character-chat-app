'use client';

import { SignInPage } from '@/modules/auth/view/sign-in-page/sign-in-page';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/chat');
    }
  }, [user, router]);

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
      </div>
    );
  }

  return <SignInPage />;
}