import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // User'ı almayı dene
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // Public paths tanımla
    const publicPaths = ['/', '/sign-in'];
    const authPaths = ['/auth/callback'];
    const isPublicPath = publicPaths.includes(path);
    const isAuthPath = authPaths.includes(path);

    // Auth callback path'i için özel işlem yapma, direkt geç
    if (isAuthPath) {
        return supabaseResponse;
    }

    // User varsa ve public path'teyse (örn. sign-in veya home), chat'e yönlendir
    if (user && isPublicPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/chat';
        return NextResponse.redirect(url);
    }

    // User yoksa ve protected path'teyse, ana sayfaya yönlendir
    if (!user && !isPublicPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}