import { NextResponse } from 'next/server';
import { createClient } from '@/core/api/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;
    const next = requestUrl.searchParams.get('next') ?? '/chat';

    if (code) {
        try {
            const supabase = await createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error('Error exchanging code for session:', error);
                return NextResponse.redirect(`${origin}/?error=auth_failed`);
            }

            // Başarılı authentication sonrası yönlendirme
            return NextResponse.redirect(`${origin}${next}`);
        } catch (error) {
            console.error('Auth callback error:', error);
            return NextResponse.redirect(`${origin}/?error=auth_failed`);
        }
    }

    // Code yoksa ana sayfaya yönlendir
    return NextResponse.redirect(`${origin}/`);
}