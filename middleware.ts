import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { isAdminEmail } from '@/lib/admin';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isPublicPath = 
    request.nextUrl.pathname === '/' || 
    request.nextUrl.pathname === '/login' || 
    request.nextUrl.pathname === '/register' ||
    request.nextUrl.pathname.startsWith('/auth/') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i);

  if (!isPublicPath && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'auth_required');
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname.startsWith('/admin') && !isAdminEmail(user?.email)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Temporarily disable creating new P2P ads while keeping edit flow available.
  if (request.nextUrl.pathname === '/p2p/post-ad' && !request.nextUrl.searchParams.get('edit')) {
    return NextResponse.redirect(new URL('/p2p?postAdDisabled=1', request.url));
  }

  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
