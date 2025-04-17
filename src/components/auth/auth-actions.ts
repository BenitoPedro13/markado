'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { cookies } from 'next/headers';

// Sign in with Google
export async function signInWithGoogle(redirectTo: string = '/') {
  return nextAuthSignIn('google', {
    redirectTo,
    redirect: true
  });
} 

// Sign in with email and password
export async function signInWithEmailPassword(email: string, password: string, redirectTo: string = '/') {
  return nextAuthSignIn('credentials', {
    email,
    password,
    redirectTo,
    redirect: true
  });
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
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'pt';
  
  return nextAuthSignOut({ 
    redirect: true,
    redirectTo: `/${locale}/logout`
  });
}