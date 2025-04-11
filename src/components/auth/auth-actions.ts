'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';

export async function signInWithGoogle() {
  return nextAuthSignIn('google');
} 

export async function signOut() {
  return nextAuthSignOut()
}