import { apiClient } from './api';
import {
  Project,
  ProjectMember,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectStatus,
  ProjectMemberRole,
} from '@/types';

export class ProjectService {
  private readonly BASE_URL = '/api/projects';

  // Project CRUD operations
  async getAllProjects(): Promise<Project[]> {
    return await apiClient.get<Project[]>(this.BASE_URL);
  }

  async getProjectById(id: number): Promise<Project> {
    return await apiClient.get<Project>(`${this.BASE_URL}/${id}`);
  }

  async getProjectWithDetails(id: number): Promise<Project> {
    return await apiClient.get<Project>(`${this.BASE_URL}/${id}/details`);
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    return await apiClient.get<Project[]>(`${this.BASE_URL}/user/${userId}`);
  }

  async getMyProjects(): Promise<Project[]> {
    return await apiClient.get<Project[]>(`${this.BASE_URL}/my-projects`);
  }

  async getProjectsByStatus(status: ProjectStatus): Promise<Project[]> {
    return await apiClient.get<Project[]>(`${this.BASE_URL}/status/${status}`);
  }

  async getProjectsByManager(managerId: number): Promise<Project[]> {
    return await apiClient.get<Project[]>(`${this.BASE_URL}/manager/${managerId}`);
  }

  async getOverdueProjects(): Promise<Project[]> {
    return await apiClient.get<Project[]>(`${this.BASE_URL}/overdue`);
  }

  async getProjectStatusCounts(): Promise<Record<ProjectStatus, number>> {
    return await apiClient.get<Record<ProjectStatus, number>>(`${this.BASE_URL}/status-counts`);
  }

  async searchProjects(searchTerm: string, userId?: number): Promise<Project[]> {
    const params: any = { searchTerm };
    if (userId) params.userId = userId;
    return await apiClient.get<Project[]>(`${this.BASE_URL}/search`, params);
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    return await apiClient.post<Project>(this.BASE_URL, data);
  }

  async updateProject(id: number, data: UpdateProjectRequest): Promise<Project> {
    return await apiClient.put<Project>(`${this.BASE_URL}/${id}`, data);
  }

  async deleteProject(id: number): Promise<void> {
    return await apiClient.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Project member management
  async getProjectMembers(projectId: number): Promise<ProjectMember[]> {
    return await apiClient.get<ProjectMember[]>(`${this.BASE_URL}/${projectId}/members`);
  }

  async addProjectMember(
    projectId: number,
    userId: number,
    role: ProjectMemberRole
  ): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>(`${this.BASE_URL}/${projectId}/members`, {
      userId,
      role,
    });
  }

  async removeProjectMember(projectId: number, userId: number): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(
      `${this.BASE_URL}/${projectId}/members/${userId}`
    );
  }

  async updateProjectMemberRole(
    projectId: number,
    userId: number,
    role: ProjectMemberRole
  ): Promise<{ message: string }> {
    return await apiClient.put<{ message: string }>(
      `${this.BASE_URL}/${projectId}/members/${userId}/role`,
      { role }
    );
  }
}

export const projectService = new ProjectService();