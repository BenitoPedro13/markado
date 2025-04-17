import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/pt/sign-in',
  '/pt/sign-up',
  '/pt/verify-email',
  '/api',
  '/_next',
  '/favicon.ico',
];

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
      const signUpUrl = new URL('/pt/sign-up', request.url);
      signUpUrl.searchParams.set('redirect', '/');
      return NextResponse.redirect(signUpUrl);
    }
    
    // Get the locale from the pathname (e.g., /pt/something -> pt)
    // If it's the root path, default to 'pt'
    const pathParts = pathname.split('/').filter(Boolean);
    const locale = pathParts.length > 0 ? pathParts[0] : 'pt';
    
    // Create the sign-up URL with the correct locale
    const signUpUrl = new URL(`/${locale}/sign-up`, request.url);
    
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
