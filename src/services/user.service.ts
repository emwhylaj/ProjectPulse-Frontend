import { apiClient } from './api';
import { mockApiService } from './mockApi.service';
import { User, UserRole, PaginatedResponse } from '@/types';

// Use mock API for development/demo purposes
const USE_MOCK_API = true;

export class UserService {
  private readonly BASE_URL = '/api/users';

  // User CRUD operations
  async getAllUsers(): Promise<User[]> {
    return USE_MOCK_API
      ? await mockApiService.getAllUsers()
      : await apiClient.get<User[]>(this.BASE_URL);
  }

  async getUserById(id: number): Promise<User> {
    return await apiClient.get<User>(`${this.BASE_URL}/${id}`);
  }

  async getUsersPaginated(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    role?: UserRole
  ): Promise<PaginatedResponse<User>> {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (role) params.role = role;
    return await apiClient.get<PaginatedResponse<User>>(this.BASE_URL, params);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await apiClient.get<User[]>(`${this.BASE_URL}/role/${role}`);
  }

  async getActiveUsers(): Promise<User[]> {
    return await apiClient.get<User[]>(`${this.BASE_URL}/active`);
  }

  async getUserProjects(userId: number): Promise<any[]> {
    return await apiClient.get<any[]>(`${this.BASE_URL}/${userId}/projects`);
  }

  async getUserTasks(userId: number): Promise<any[]> {
    return await apiClient.get<any[]>(`${this.BASE_URL}/${userId}/tasks`);
  }

  async getUserNotifications(userId: number): Promise<any[]> {
    return await apiClient.get<any[]>(`${this.BASE_URL}/${userId}/notifications`);
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    return await apiClient.get<User[]>(`${this.BASE_URL}/search`, { searchTerm });
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: UserRole;
  }): Promise<User> {
    return await apiClient.post<User>(this.BASE_URL, data);
  }

  async updateUser(id: number, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    role?: UserRole;
    isActive?: boolean;
    profileImageUrl?: string;
  }): Promise<User> {
    return await apiClient.put<User>(`${this.BASE_URL}/${id}`, data);
  }

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
  }): Promise<User> {
    return await apiClient.put<User>(`${this.BASE_URL}/profile`, data);
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>(`${this.BASE_URL}/change-password`, data);
  }

  async deleteUser(id: number): Promise<void> {
    return await apiClient.delete<void>(`${this.BASE_URL}/${id}`);
  }

  async deactivateUser(id: number): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/${id}/deactivate`);
  }

  async activateUser(id: number): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/${id}/activate`);
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>(`${this.BASE_URL}/reset-password`, { email });
  }

  async uploadProfileImage(file: File, onProgress?: (progress: number) => void): Promise<{ imageUrl: string }> {
    return await apiClient.uploadFile<{ imageUrl: string }>(`${this.BASE_URL}/profile/image`, file, onProgress);
  }

  // User statistics and analytics
  async getUserStats(userId: number): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    taskCompletionRate: number;
  }> {
    return await apiClient.get<{
      totalProjects: number;
      activeProjects: number;
      totalTasks: number;
      completedTasks: number;
      overdueTasks: number;
      taskCompletionRate: number;
    }>(`${this.BASE_URL}/${userId}/stats`);
  }

  async getMyStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    taskCompletionRate: number;
  }> {
    if (USE_MOCK_API) {
      return await mockApiService.getMyStats();
    }
    return await apiClient.get<{
      totalProjects: number;
      activeProjects: number;
      totalTasks: number;
      completedTasks: number;
      overdueTasks: number;
      taskCompletionRate: number;
    }>(`${this.BASE_URL}/my-stats`);
  }
}

export const userService = new UserService();