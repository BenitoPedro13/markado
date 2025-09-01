'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';

// Sign in with Google
export async function signInWithGoogle(redirectTo: string = '/') {
  console.log(`[Auth] Google sign-in with redirect to: ${redirectTo}`);
  return nextAuthSignIn('google', {
    redirectTo,
    redirect: true
  });
} 

// Sign in with email and password
export async function signInWithEmailPassword(
  email: string,
  password: string,
  redirectTo: string = '/'
) {
  // Use redirect: false so we can handle errors gracefully and
  // return a friendly error code to the client instead of throwing.
  try {
    const result: any = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
      redirectTo,
    });

    // If NextAuth returns a URL, proceed with client-side redirect.
    if (result?.url) {
      return { ok: true, url: result.url } as const;
    }

    // NextAuth may return an error code like "CredentialsSignin" on failure.
    if (result?.error) {
      return { ok: false, code: 'invalid_credentials' } as const;
    }

    // Fallback: consider it failed if neither url nor explicit error are present
    return { ok: false, code: 'invalid_credentials' } as const;
  } catch (err: any) {
    // In case of unexpected errors, return a safe, generic message code
    return { ok: false, code: 'invalid_credentials' } as const;
  }
}

// Sign up with email and password
export async function signUpWithEmailPassword(email: string, password: string, name?: string) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      identityProvider: 'MARKADO',
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });

  return user;
}

// Sign out
export async function signOut() {
  // Get the locale from the cookie or default to 'pt'
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'pt';
  
  // Clear the onboarding_complete cookie
  cookieStore.set('onboarding_complete', '', { 
    maxAge: 0, 
    path: '/', 
  });
  
  console.log('[Auth] Signing out and clearing onboarding cookie');
  
  return nextAuthSignOut({ 
    redirect: true,
    redirectTo: `/logout`
  });
}
