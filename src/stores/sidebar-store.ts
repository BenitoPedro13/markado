'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  toggleCollapse: () => void
  collapse: () => void
  expand: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      collapse: () =>  set(() => ({ isCollapsed: true })),
      expand: () =>  set(() => ({ isCollapsed: false })),
    }),
    {
      name: 'sidebar-storage',
    }
  )
) 