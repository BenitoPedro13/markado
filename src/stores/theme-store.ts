import { createStore } from 'zustand/vanilla';

export type ThemeState = {
  isDarkMode: boolean;
};

export type ThemeActions = {
  toggleDarkMode: () => void;
  setDarkMode: (isDarkMode: boolean) => void;
};

export type ThemeStore = ThemeState & ThemeActions;

export const defaultThemeState: ThemeState = {
  isDarkMode: false,
};

// This function can be used to initialize the store with data from next-themes
export const initThemeStore = (): ThemeState => {
  // Default to light mode if we're not in a browser environment
  return defaultThemeState;
};

export const createThemeStore = (
  initState: ThemeState = defaultThemeState,
) => {
  return createStore<ThemeStore>()((set) => ({
    ...initState,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    setDarkMode: (isDarkMode) => set({ isDarkMode }),
  }));
}; 