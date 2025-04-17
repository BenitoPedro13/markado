'use client'

import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { useTheme } from 'next-themes'

import {
  type ThemeStore,
  createThemeStore,
  initThemeStore,
} from '@/stores/theme-store'

export type ThemeStoreApi = ReturnType<typeof createThemeStore>

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
  undefined,
)

export interface ThemeStoreProviderProps {
  children: ReactNode
}

export const ThemeStoreProvider = ({
  children,
}: ThemeStoreProviderProps) => {
  const storeRef = useRef<ThemeStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createThemeStore()
  }

  // Get the theme from next-themes
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  // Sync the store with next-themes
  useEffect(() => {
    const store = storeRef.current
    if (store) {
      // Initialize the store with the current theme
      const isDarkMode = resolvedTheme === 'dark'
      store.setState({ isDarkMode })
      
      // Subscribe to changes in the store and update next-themes
      const unsubscribe = store.subscribe((state) => {
        if (typeof window !== 'undefined') {
          setTheme(state.isDarkMode ? 'dark' : 'light')
        }
      })
      
      return () => unsubscribe()
    }
  }, [resolvedTheme, setTheme])

  return (
    <ThemeStoreContext.Provider value={storeRef.current}>
      {children}
    </ThemeStoreContext.Provider>
  )
}

export const useThemeStore = <T,>(
  selector: (store: ThemeStore) => T,
): T => {
  const themeStoreContext = useContext(ThemeStoreContext)

  if (!themeStoreContext) {
    throw new Error(`useThemeStore must be used within ThemeStoreProvider`)
  }

  return useStore(themeStoreContext, selector)
} 