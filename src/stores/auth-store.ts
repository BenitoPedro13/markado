import { create } from 'zustand';
import { signInWithEmailPassword, signInWithGoogle, signUpWithEmailPassword } from '@/components/auth/auth-actions';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signInWithEmail: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  signInWithEmail: async (email, password, redirectTo = '/') => {
    try {
      set({ isLoading: true, error: null });
      const result: any = await signInWithEmailPassword(email, password, redirectTo);

      // If the server action returned a URL, perform a client-side redirect
      if (result?.ok && result.url) {
        if (typeof window !== 'undefined') {
          window.location.assign(result.url);
        }
        return;
      }

      // Map known error codes to UI-friendly codes handled by translations
      if (result && result.ok === false) {
        set({ error: result.code || 'invalid_credentials' });
        return;
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'invalid_credentials' });
    } finally {
      set({ isLoading: false });
    }
  },
  signInWithGoogle: async (redirectTo = '/') => {
    try {
      set({ isLoading: true, error: null });
      await signInWithGoogle(redirectTo);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      if (error?.message && !error.message.includes('OAuthAccountNotLinked')) {
        set({ error: error.message });
      } else {
        set({ error: 'An error occurred during Google sign in' });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  signUpWithEmail: async (email, password, name) => {
    try {
      set({ isLoading: true, error: null });
      await signUpWithEmailPassword(email, password, name);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred during sign up' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 
