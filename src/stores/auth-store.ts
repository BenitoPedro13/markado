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
      await signInWithEmailPassword(email, password, redirectTo);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred during sign in' });
    } finally {
      set({ isLoading: false });
    }
  },
  signInWithGoogle: async (redirectTo = '/') => {
    try {
      set({ isLoading: true, error: null });
      await signInWithGoogle(redirectTo);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred during Google sign in' });
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