import {NextResponse} from 'next/server';
import {auth} from '@/auth';
import {NextRequest} from 'next/server';
import {routing} from '@/i18n/routing';
import {match} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

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
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If the route is public, allow access
    if (isPublicRoute) {
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

    // Check if we're in edit mode (user is editing their data)
    const isEditMode = request.cookies.get('edit_mode')?.value === 'true';
    
    // Only check onboarding status for routes that require it and for /sign-up/personal
    if (requiresOnboarding && !pathname.startsWith('/sign-up/personal')) {
      // Check for a temporary next_step cookie that allows one-time navigation to a specific step
      const nextStepCookie = request.cookies.get('next_step')?.value;
      
      if (nextStepCookie && pathname === nextStepCookie) {
        console.log(`[Middleware] Found next_step cookie for: ${nextStepCookie}, allowing access`);
        
        // Create a response that clears the cookie (it's one-time use only)
        const response = NextResponse.next();
        response.cookies.set('next_step', '', { maxAge: 0, path: '/' });
        
        return response;
      }
      
      // Check for step-specific completion cookies
      const personalStepComplete = request.cookies.get('personal_step_complete')?.value === 'true';
      const calendarStepComplete = request.cookies.get('calendar_step_complete')?.value === 'true';
      const availabilityStepComplete = request.cookies.get('availability_step_complete')?.value === 'true';
      
      // If in edit mode, allow access to any sign-up step
      if (isEditMode && pathname.startsWith('/sign-up/')) {
        console.log(`[Middleware] Edit mode active, allowing access to ${pathname}`);
        return NextResponse.next();
      }
      
      // Allow access to calendar if personal is complete
      if (pathname === '/sign-up/calendar' && personalStepComplete) {
        console.log(`[Middleware] Personal step is complete, allowing access to calendar`);
        return NextResponse.next();
      }
      
      // Allow access to availability if calendar is complete
      if (pathname === '/sign-up/availability' && calendarStepComplete) {
        console.log(`[Middleware] Calendar step is complete, allowing access to availability`);
        return NextResponse.next();
      }
      
      // Allow access to ending if availability is complete
      if (pathname === '/sign-up/ending' && availabilityStepComplete) {
        console.log(`[Middleware] Availability step is complete, allowing access to ending`);
        return NextResponse.next();
      }
      
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
