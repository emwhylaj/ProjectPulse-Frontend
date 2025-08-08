import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Loading states
  globalLoading: boolean;
  
  // Notification state
  showNotifications: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setGlobalLoading: (loading: boolean) => void;
  toggleNotifications: () => void;
  setShowNotifications: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      theme: 'light',
      globalLoading: false,
      showNotifications: false,

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
      setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
      toggleNotifications: () => set((state) => ({ showNotifications: !state.showNotifications })),
      setShowNotifications: (show: boolean) => set({ showNotifications: show }),
    }),
    { name: 'AppStore' }
  )
);

// Selector hooks for common app state
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useGlobalLoading = () => useAppStore((state) => state.globalLoading);
export const useShowNotifications = () => useAppStore((state) => state.showNotifications);