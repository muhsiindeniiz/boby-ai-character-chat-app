import { NextResponse } from 'next/server';
import { createClient } from '@/core/api/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        try {
            const supabase = await createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('Error exchanging code for session:', error);
                return NextResponse.redirect(`${origin}/?error=auth_failed`);
            }
        } catch (error) {
            console.error('Auth callback error:', error);
            return NextResponse.redirect(`${origin}/?error=auth_failed`);
        }
    }

    return NextResponse.redirect(`${origin}/chat`);
}