import { apiClient } from './api';
import { mockApiService } from './mockApi.service';
import {
  Task,
  TaskComment,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
} from '@/types';

// Use mock API for development/demo purposes
const USE_MOCK_API = true;

export class TaskService {
  private readonly BASE_URL = '/api/tasks';

  // Task CRUD operations
  async getAllTasks(): Promise<Task[]> {
    return USE_MOCK_API
      ? await mockApiService.getAllTasks()
      : await apiClient.get<Task[]>(this.BASE_URL);
  }

  async getTaskById(id: number): Promise<Task> {
    return await apiClient.get<Task>(`${this.BASE_URL}/${id}`);
  }

  async getTaskWithDetails(id: number): Promise<Task> {
    return await apiClient.get<Task>(`${this.BASE_URL}/${id}/details`);
  }

  async getUserTasks(userId: number, status?: TaskStatus): Promise<Task[]> {
    const params: any = {};
    if (status) params.status = status;
    return await apiClient.get<Task[]>(`${this.BASE_URL}/user/${userId}`, params);
  }

  async getMyTasks(status?: TaskStatus): Promise<Task[]> {
    if (USE_MOCK_API) {
      return await mockApiService.getMyTasks(status);
    }
    const params: any = {};
    if (status) params.status = status;
    return await apiClient.get<Task[]>(`${this.BASE_URL}/my-tasks`, params);
  }

  async getProjectTasks(projectId: number): Promise<Task[]> {
    return await apiClient.get<Task[]>(`${this.BASE_URL}/project/${projectId}`);
  }

  async getOverdueTasks(): Promise<Task[]> {
    return USE_MOCK_API
      ? await mockApiService.getOverdueTasks()
      : await apiClient.get<Task[]>(`${this.BASE_URL}/overdue`);
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return await apiClient.get<Task[]>(`${this.BASE_URL}/status/${status}`);
  }

  async getSubTasks(parentTaskId: number): Promise<Task[]> {
    return await apiClient.get<Task[]>(`${this.BASE_URL}/${parentTaskId}/subtasks`);
  }

  async getTaskStatusCounts(projectId?: number): Promise<Record<TaskStatus, number>> {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    return await apiClient.get<Record<TaskStatus, number>>(`${this.BASE_URL}/status-counts`, params);
  }

  async getTasksDueSoon(days: number = 3): Promise<Task[]> {
    return USE_MOCK_API
      ? await mockApiService.getTasksDueSoon(days)
      : await apiClient.get<Task[]>(`${this.BASE_URL}/due-soon`, { days });
  }

  async searchTasks(
    searchTerm: string,
    projectId?: number,
    userId?: number
  ): Promise<Task[]> {
    const params: any = { searchTerm };
    if (projectId) params.projectId = projectId;
    if (userId) params.userId = userId;
    return await apiClient.get<Task[]>(`${this.BASE_URL}/search`, params);
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return await apiClient.post<Task>(this.BASE_URL, data);
  }

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    return await apiClient.put<Task>(`${this.BASE_URL}/${id}`, data);
  }

  async deleteTask(id: number): Promise<void> {
    return await apiClient.delete<void>(`${this.BASE_URL}/${id}`);
  }

  // Task management actions
  async assignTask(taskId: number, userId: number): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/${taskId}/assign`, {
      userId,
    });
  }

  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/${taskId}/status`, {
      status,
    });
  }

  async updateTaskProgress(taskId: number, progress: number): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/${taskId}/progress`, {
      progress,
    });
  }

  // Task comments
  async getTaskComments(taskId: number): Promise<TaskComment[]> {
    return await apiClient.get<TaskComment[]>(`${this.BASE_URL}/${taskId}/comments`);
  }

  async addTaskComment(taskId: number, content: string): Promise<TaskComment> {
    return await apiClient.post<TaskComment>(`${this.BASE_URL}/${taskId}/comments`, {
      content,
    });
  }
}

export const taskService = new TaskService();