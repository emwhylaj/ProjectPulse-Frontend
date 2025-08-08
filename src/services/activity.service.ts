import { apiClient } from './api';
import { ProjectActivity, ActivityType, PaginatedResponse } from '@/types';

export class ActivityService {
  private readonly BASE_URL = '/api/activities';

  // Activity retrieval
  async getAllActivities(
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<ProjectActivity>> {
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(this.BASE_URL, { page, pageSize });
  }

  async getActivityById(id: number): Promise<ProjectActivity> {
    return await apiClient.get<ProjectActivity>(`${this.BASE_URL}/${id}`);
  }

  async getProjectActivities(
    projectId: number,
    page: number = 1,
    pageSize: number = 20,
    activityType?: ActivityType
  ): Promise<PaginatedResponse<ProjectActivity>> {
    const params: any = { page, pageSize };
    if (activityType) params.activityType = activityType;
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(
      `${this.BASE_URL}/project/${projectId}`,
      params
    );
  }

  async getUserActivities(
    userId: number,
    page: number = 1,
    pageSize: number = 20,
    activityType?: ActivityType
  ): Promise<PaginatedResponse<ProjectActivity>> {
    const params: any = { page, pageSize };
    if (activityType) params.activityType = activityType;
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(
      `${this.BASE_URL}/user/${userId}`,
      params
    );
  }

  async getMyActivities(
    page: number = 1,
    pageSize: number = 20,
    activityType?: ActivityType
  ): Promise<PaginatedResponse<ProjectActivity>> {
    const params: any = { page, pageSize };
    if (activityType) params.activityType = activityType;
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(`${this.BASE_URL}/my-activities`, params);
  }

  async getActivitiesByType(
    activityType: ActivityType,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<ProjectActivity>> {
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(
      `${this.BASE_URL}/type/${activityType}`,
      { page, pageSize }
    );
  }

  async getRecentActivities(
    limit: number = 20,
    projectId?: number,
    userId?: number
  ): Promise<ProjectActivity[]> {
    const params: any = { limit };
    if (projectId) params.projectId = projectId;
    if (userId) params.userId = userId;
    return await apiClient.get<ProjectActivity[]>(`${this.BASE_URL}/recent`, params);
  }

  async getActivityFeed(
    page: number = 1,
    pageSize: number = 20,
    includeOwnActivities: boolean = true
  ): Promise<PaginatedResponse<ProjectActivity>> {
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(`${this.BASE_URL}/feed`, {
      page,
      pageSize,
      includeOwnActivities,
    });
  }

  async getEntityActivities(
    entityType: string,
    entityId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<ProjectActivity>> {
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(`${this.BASE_URL}/entity`, {
      entityType,
      entityId,
      page,
      pageSize,
    });
  }

  // Activity filtering and search
  async searchActivities(
    searchTerm: string,
    page: number = 1,
    pageSize: number = 20,
    projectId?: number,
    activityType?: ActivityType
  ): Promise<PaginatedResponse<ProjectActivity>> {
    const params: any = { searchTerm, page, pageSize };
    if (projectId) params.projectId = projectId;
    if (activityType) params.activityType = activityType;
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(`${this.BASE_URL}/search`, params);
  }

  async getActivitiesByDateRange(
    startDate: string,
    endDate: string,
    page: number = 1,
    pageSize: number = 20,
    projectId?: number,
    userId?: number
  ): Promise<PaginatedResponse<ProjectActivity>> {
    const params: any = { startDate, endDate, page, pageSize };
    if (projectId) params.projectId = projectId;
    if (userId) params.userId = userId;
    return await apiClient.get<PaginatedResponse<ProjectActivity>>(`${this.BASE_URL}/date-range`, params);
  }

  // Activity creation (typically done automatically by the system)
  async createActivity(data: {
    projectId: number;
    userId: number;
    activityType: ActivityType;
    description: string;
    entityType?: string;
    entityId?: number;
    oldValues?: string;
    newValues?: string;
  }): Promise<ProjectActivity> {
    return await apiClient.post<ProjectActivity>(this.BASE_URL, data);
  }

  // Activity analytics and statistics
  async getActivityStats(
    projectId?: number,
    userId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    total: number;
    byType: Record<ActivityType, number>;
    byUser: Record<number, number>;
    byDate: Record<string, number>;
  }> {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (userId) params.userId = userId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    return await apiClient.get<{
      total: number;
      byType: Record<ActivityType, number>;
      byUser: Record<number, number>;
      byDate: Record<string, number>;
    }>(`${this.BASE_URL}/stats`, params);
  }

  async getProjectActivityTimeline(
    projectId: number,
    limit: number = 50
  ): Promise<ProjectActivity[]> {
    return await apiClient.get<ProjectActivity[]>(`${this.BASE_URL}/project/${projectId}/timeline`, { limit });
  }

  async getUserActivitySummary(
    userId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalActivities: number;
    projectsWorkedOn: number;
    tasksModified: number;
    mostActiveProject: string;
    activityByType: Record<ActivityType, number>;
  }> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    return await apiClient.get<{
      totalActivities: number;
      projectsWorkedOn: number;
      tasksModified: number;
      mostActiveProject: string;
      activityByType: Record<ActivityType, number>;
    }>(`${this.BASE_URL}/user/${userId}/summary`, params);
  }

  // Activity cleanup (admin functionality)
  async deleteActivity(id: number): Promise<void> {
    return await apiClient.delete<void>(`${this.BASE_URL}/${id}`);
  }

  async deleteOldActivities(olderThanDays: number): Promise<{ message: string; deletedCount: number }> {
    // Note: For delete with body, we need to configure axios properly
    return await apiClient.client.delete(`${this.BASE_URL}/cleanup`, {
      data: { olderThanDays },
    }).then(response => response.data);
  }
}

export const activityService = new ActivityService();