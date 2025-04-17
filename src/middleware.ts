import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Define public routes that don't require authentication
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/check-email',
  '/password-recovery',
  '/reset-password',
  '/logout',
  '/api',
  '/_next',
  '/favicon.ico',
];

function getLocale(request: NextRequest): string {
  // Check cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // Then check Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = routing.locales;
  
  return match(languages, locales, routing.defaultLocale);
}

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // If the route is public, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If the user is not authenticated and trying to access a protected route, redirect to sign-up
  if (!session) {
    // Special handling for root path
    if (pathname === '/') {
      const signUpUrl = new URL('/sign-up', request.url);
      signUpUrl.searchParams.set('redirect', '/');
      return NextResponse.redirect(signUpUrl);
    }
    
    // Create the sign-up URL
    const signUpUrl = new URL('/sign-up', request.url);
    
    // Add the original URL as a redirect parameter, but only if it's not already a redirect
    if (!pathname.includes('redirect=')) {
      signUpUrl.searchParams.set('redirect', pathname);
    }
    
    return NextResponse.redirect(signUpUrl);
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
