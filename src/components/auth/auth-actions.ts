'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';

export async function signInWithGoogle(redirectTo: string = '/') {
  return nextAuthSignIn('google', {
    redirectTo,
    redirect: true
  });
} 

export async function signOut() {
  return nextAuthSignOut({ 
    redirect: true,
    redirectTo: '/pt/sign-in'
  });
}