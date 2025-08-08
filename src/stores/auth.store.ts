import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, AuthResult, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<AuthResult>;
  register: (data: RegisterRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  checkAuthState: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (credentials: LoginRequest): Promise<AuthResult> => {
          set({ isLoading: true, error: null });
          
          try {
            const result = await authService.login(credentials);
            
            if (result.success && result.user) {
              set({
                user: result.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              toast.success('Login successful!');
            } else {
              set({
                isLoading: false,
                error: result.message || 'Login failed',
              });
              toast.error(result.message || 'Login failed');
            }
            
            return result;
          } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Login failed';
            set({
              isLoading: false,
              error: errorMessage,
            });
            toast.error(errorMessage);
            return {
              success: false,
              message: errorMessage,
            };
          }
        },

        register: async (data: RegisterRequest): Promise<AuthResult> => {
          set({ isLoading: true, error: null });
          
          try {
            const result = await authService.register(data);
            
            if (result.success && result.user) {
              set({
                user: result.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              toast.success('Registration successful!');
            } else {
              set({
                isLoading: false,
                error: result.message || 'Registration failed',
              });
              toast.error(result.message || 'Registration failed');
            }
            
            return result;
          } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Registration failed';
            set({
              isLoading: false,
              error: errorMessage,
            });
            toast.error(errorMessage);
            return {
              success: false,
              message: errorMessage,
            };
          }
        },

        logout: async (): Promise<void> => {
          set({ isLoading: true });
          
          try {
            await authService.logout();
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            toast.success('Logged out successfully');
          } catch (error: any) {
            // Even if logout fails on server, clear local state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            console.warn('Logout error:', error);
          }
        },

        getCurrentUser: async (): Promise<void> => {
          if (!authService.isAuthenticated()) {
            return;
          }
          
          set({ isLoading: true });
          
          try {
            const user = await authService.getCurrentUser();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            console.error('Failed to get current user:', error);
            // If token is invalid, clear auth state
            if (error?.response?.status === 401) {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            } else {
              set({
                isLoading: false,
                error: 'Failed to load user data',
              });
            }
          }
        },

        refreshToken: async (): Promise<boolean> => {
          try {
            const result = await authService.refreshToken();
            if (result.success) {
              return true;
            }
            return false;
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Clear auth state on refresh failure
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            });
            return false;
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },

        checkAuthState: () => {
          const isAuthenticated = authService.isAuthenticated();
          const user = authService.getUser();
          
          if (isAuthenticated && user) {
            set({
              user,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// Helper hooks for common auth checks
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Role-based access control hooks
export const useHasRole = (role: string) => {
  const user = useCurrentUser();
  return user?.role === role;
};

export const useHasAnyRole = (roles: string[]) => {
  const user = useCurrentUser();
  return user ? roles.includes(user.role) : false;
};

export const useIsAdmin = () => useHasRole('Admin');
export const useIsProjectManager = () => useHasRole('ProjectManager');
export const useCanManageProjects = () => useHasAnyRole(['Admin', 'ProjectManager']);