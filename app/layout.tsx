import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/modules/auth/providers/auth-provider';
import '@/packages/asset/style/global.scss';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Boby AI | Character Chat App',
  description: 'Chat with AI characters powered by Boby AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}