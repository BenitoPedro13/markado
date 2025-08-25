import {NextResponse} from 'next/server';
import {auth} from '@/auth';
import {NextRequest} from 'next/server';
import {routing} from '@/i18n/routing';
import {match} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { prisma } from '@/lib/prisma';

// Define public routes that don't require authentication
const publicRoutes = [
  '/calendar',
  '/sign-in',
  '/verify-email',
  '/check-email',
  '/password-recovery',
  '/reset-password',
  '/logout',
  '/api',
  '/sign-up',
  '/sign-up/email',
  '/api/trpc',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
  '/locales'
];

// Define routes that don't require onboarding
const noOnboardingRoutes = [
  '/calendar',
  '/sign-in',
  '/verify-email',
  '/check-email',
  '/password-recovery',
  '/reset-password',
  '/logout',
  '/api',
  '/sign-up',
  '/api/trpc',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
  '/locales'
];

// Define onboarding flow routes
const onboardingFlowRoutes = [
  '/sign-up/personal',
  '/sign-up/calendar',
  '/sign-up/availability',
  '/sign-up/profile',
  '/sign-up/summary',
  '/sign-up/ending'
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

  const languages = new Negotiator({headers: negotiatorHeaders}).languages();
  const locales = routing.locales;

  return match(languages, locales, routing.defaultLocale);
}

export async function middleware(request: NextRequest) {
  try {
    const session = await auth();
    const {pathname} = request.nextUrl;
    
    // Create the response early so we can add headers
    const response = NextResponse.next();
    
    // Add the pathname as a header so layouts can access it
    response.headers.set('x-pathname', pathname);

    // Check if the route is public
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // Treat /:username (and subpaths) as public unless the first segment is a reserved prefix
    const segments = pathname.split('/').filter(Boolean);
    const reserved = new Set(
      publicRoutes
        .map((r) => r.split('/').filter(Boolean)[0])
        .filter(Boolean)
        .concat([
          'services',
          'availability',
          'settings',
          'bookings',
          'booking',
          'reschedule',
          'sitemap.xml',
        ])
    );
    const isUsernameNamespace = segments.length >= 1 && !reserved.has(segments[0]);

    // If the route is public or within a username namespace, allow access
    if (isPublicRoute || isUsernameNamespace) {
      return response;
    }

    // If the user is not authenticated and trying to access a protected route, redirect to sign-up
    if (!session?.user) {
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

    // Check if the route requires onboarding
    const requiresOnboarding = !noOnboardingRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Check if we're in the onboarding flow
    const isOnboardingFlow = onboardingFlowRoutes.some((route) =>
      pathname.startsWith(route)
    );
    
    // If we're in the onboarding flow, allow access
    if (isOnboardingFlow) {
      return response;
    }
    

    if (session?.user?.id) {
      // Server-side middleware checks onboarding status via direct DB query
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { completedOnboarding: true },
      });

      if (!user?.completedOnboarding) {
        const personalUrl = new URL('/sign-up/personal', request.url);
        if (!pathname.includes('redirect=')) {
          personalUrl.searchParams.set('redirect', pathname);
        }
        return NextResponse.redirect(personalUrl);
      }
    }
    
    // Only check onboarding status for routes that require it and not in onboarding flow
    if (requiresOnboarding) {
      // Get the onboarding status from the cookie
      const onboardingComplete =
        request.cookies.get('onboarding_complete')?.value === 'true';
      console.log(`[Middleware] User: ${session.user.email}, Path: ${pathname}, Onboarding complete: ${onboardingComplete}`);

      if (!onboardingComplete) {
        // Redirect to personal info page
        const personalUrl = new URL('/sign-up/personal', request.url);
        if (!pathname.includes('redirect=')) {
          personalUrl.searchParams.set('redirect', pathname);
        }
        console.log(`[Middleware] Redirecting to: ${personalUrl.toString()}`);
        return NextResponse.redirect(personalUrl);
      }
    }

    // User is authenticated and has completed onboarding (or route doesn't require it), allow access
    // Set a cookie indicating the user is authenticated
    response.cookies.set('user_authenticated', 'true', {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow access to avoid blocking users
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
