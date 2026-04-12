import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth_session');

  const isPublicPath = 
    request.nextUrl.pathname === '/' || 
    request.nextUrl.pathname === '/login' || 
    request.nextUrl.pathname === '/register' ||
    request.nextUrl.pathname === '/splash' ||
    request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i);

  // If trying to access a secure route without the auth cookie, bounce them to login
  if (!isPublicPath && !authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'auth_required');
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in, prevent going to login/register manually
  if (authCookie && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
