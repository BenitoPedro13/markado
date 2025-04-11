'use server';

import { signIn as nextAuthSignIn } from '@/auth';

export async function signInWithGoogle() {
  return nextAuthSignIn('google');
} 