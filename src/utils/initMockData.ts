import { useAuthStore } from '@/stores/auth.store';
import { dummyUsers } from '@/data/dummyData';
import { apiClient } from '@/services/api';

/**
 * Initialize the application with mock user data for demo purposes
 * This function automatically logs in the admin user for demonstration
 */
export const initializeMockData = () => {
  const authStore = useAuthStore.getState();
  
  // Check if user is already authenticated
  if (authStore.isAuthenticated && authStore.user) {
    return;
  }

  // Set up mock authentication
  const mockUser = dummyUsers[0]; // Use admin user as default
  const mockToken = 'mock-jwt-token';

  // Set the auth token
  apiClient.setAuthToken(mockToken);
  
  // Set the user in the auth store
  authStore.setUser(mockUser);
  
  console.log('Mock data initialized with user:', mockUser.email);
};

/**
 * Clear mock data and reset authentication state
 */
export const clearMockData = () => {
  const authStore = useAuthStore.getState();
  apiClient.clearAuthToken();
  authStore.setUser(null);
  console.log('Mock data cleared');
};

/**
 * Switch to a different mock user for testing different roles
 */
export const switchMockUser = (userId: number) => {
  const user = dummyUsers.find(u => u.id === userId);
  if (user) {
    const authStore = useAuthStore.getState();
    authStore.setUser(user);
    console.log('Switched to mock user:', user.email, '- Role:', user.role);
  }
};