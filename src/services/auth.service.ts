import { apiClient } from './api';
import { mockApiService } from './mockApi.service';
import { AuthResult, LoginRequest, RegisterRequest, User } from '@/types';
import Cookies from 'js-cookie';

// Use mock API for development/demo purposes
const USE_MOCK_API = true;

export class AuthService {
  private readonly BASE_URL = '/api/auth';

  async login(credentials: LoginRequest): Promise<AuthResult> {
    const result = USE_MOCK_API 
      ? await mockApiService.login(credentials.email, credentials.password)
      : await apiClient.post<AuthResult>(`${this.BASE_URL}/login`, credentials);
    
    if (result.success && result.token && result.user) {
      apiClient.setAuthToken(result.token);
      this.setUser(result.user);
    }
    
    return result;
  }

  async register(data: RegisterRequest): Promise<AuthResult> {
    const result = USE_MOCK_API
      ? await mockApiService.register(data)
      : await apiClient.post<AuthResult>(`${this.BASE_URL}/register`, data);
    
    if (result.success && result.token && result.user) {
      apiClient.setAuthToken(result.token);
      this.setUser(result.user);
    }
    
    return result;
  }

  async logout(): Promise<void> {
    try {
      // In mock mode, we don't need to call the API
      if (USE_MOCK_API) {
        // Just simulate a small delay for UX
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        await apiClient.post(`${this.BASE_URL}/logout`);
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      apiClient.clearAuthToken();
      this.clearUser();
    }
  }

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK_API) {
      const user = await mockApiService.getCurrentUser();
      if (!user) throw new Error('User not found');
      return user;
    }
    return await apiClient.get<User>(`${this.BASE_URL}/me`);
  }

  async refreshToken(): Promise<AuthResult> {
    const result = await apiClient.post<AuthResult>(`${this.BASE_URL}/refresh`);
    
    if (result.success && result.token) {
      apiClient.setAuthToken(result.token);
    }
    
    return result;
  }

  async validateToken(): Promise<{ valid: boolean }> {
    return await apiClient.post<{ valid: boolean }>(`${this.BASE_URL}/validate`);
  }

  // User management
  setUser(user: User): void {
    Cookies.set('user', JSON.stringify(user), { expires: 1, secure: true, sameSite: 'strict' });
  }

  getUser(): User | null {
    const userData = Cookies.get('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        this.clearUser();
      }
    }
    return null;
  }

  clearUser(): void {
    Cookies.remove('user');
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated() && this.getUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return user ? roles.includes(user.role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isProjectManager(): boolean {
    return this.hasRole('ProjectManager');
  }

  canManageProjects(): boolean {
    return this.hasAnyRole(['Admin', 'ProjectManager']);
  }
}

export const authService = new AuthService();