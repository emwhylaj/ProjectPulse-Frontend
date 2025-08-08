import { apiClient } from './api';
import { Notification, NotificationType, PaginatedResponse } from '@/types';

export class NotificationService {
  private readonly BASE_URL = '/api/notifications';

  // Notification retrieval
  async getAllNotifications(): Promise<Notification[]> {
    return await apiClient.get<Notification[]>(this.BASE_URL);
  }

  async getNotificationById(id: number): Promise<Notification> {
    return await apiClient.get<Notification>(`${this.BASE_URL}/${id}`);
  }

  async getUserNotifications(
    userId: number,
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedResponse<Notification>> {
    const params: any = { page, pageSize };
    if (unreadOnly) params.unreadOnly = true;
    return await apiClient.get<PaginatedResponse<Notification>>(`${this.BASE_URL}/user/${userId}`, params);
  }

  async getMyNotifications(
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedResponse<Notification>> {
    const params: any = { page, pageSize };
    if (unreadOnly) params.unreadOnly = true;
    return await apiClient.get<PaginatedResponse<Notification>>(`${this.BASE_URL}/my-notifications`, params);
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return await apiClient.get<Notification[]>(`${this.BASE_URL}/unread`);
  }

  async getNotificationsByType(type: NotificationType): Promise<Notification[]> {
    return await apiClient.get<Notification[]>(`${this.BASE_URL}/type/${type}`);
  }

  async getRecentNotifications(limit: number = 10): Promise<Notification[]> {
    return await apiClient.get<Notification[]>(`${this.BASE_URL}/recent`, { limit });
  }

  async getNotificationCounts(): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
  }> {
    return await apiClient.get<{
      total: number;
      unread: number;
      byType: Record<NotificationType, number>;
    }>(`${this.BASE_URL}/counts`);
  }

  // Notification management
  async markAsRead(id: number): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/${id}/read`);
  }

  async markAsUnread(id: number): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/${id}/unread`);
  }

  async markAllAsRead(userId?: number): Promise<{ message: string }> {
    const params: any = {};
    if (userId) params.userId = userId;
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/mark-all-read`, params);
  }

  async markMultipleAsRead(notificationIds: number[]): Promise<{ message: string }> {
    return await apiClient.patch<{ message: string }>(`${this.BASE_URL}/mark-multiple-read`, {
      notificationIds,
    });
  }

  async deleteNotification(id: number): Promise<void> {
    return await apiClient.delete<void>(`${this.BASE_URL}/${id}`);
  }

  async deleteMultipleNotifications(notificationIds: number[]): Promise<{ message: string }> {
    return await apiClient.client.delete(`${this.BASE_URL}/delete-multiple`, {
      data: { notificationIds },
    }).then(response => response.data);
  }

  async deleteAllReadNotifications(): Promise<{ message: string }> {
    return await apiClient.delete<{ message: string }>(`${this.BASE_URL}/delete-all-read`);
  }

  // Create notifications (typically used by admin/system)
  async createNotification(data: {
    userId: number;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    relatedEntityType?: string;
    relatedEntityId?: number;
  }): Promise<Notification> {
    return await apiClient.post<Notification>(this.BASE_URL, data);
  }

  async createBulkNotifications(data: {
    userIds: number[];
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    relatedEntityType?: string;
    relatedEntityId?: number;
  }): Promise<{ message: string; count: number }> {
    return await apiClient.post<{ message: string; count: number }>(`${this.BASE_URL}/bulk`, data);
  }

  // Notification preferences (if implemented in backend)
  async getNotificationPreferences(): Promise<Record<NotificationType, boolean>> {
    return await apiClient.get<Record<NotificationType, boolean>>(`${this.BASE_URL}/preferences`);
  }

  async updateNotificationPreferences(
    preferences: Partial<Record<NotificationType, boolean>>
  ): Promise<{ message: string }> {
    return await apiClient.put<{ message: string }>(`${this.BASE_URL}/preferences`, preferences);
  }

  // Real-time notification setup (for WebSocket/SignalR integration)
  async setupRealTimeNotifications(userId: number, _callback: (notification: Notification) => void): Promise<void> {
    // This would typically set up WebSocket/SignalR connection
    // Implementation would depend on the real-time solution used in the backend
    console.log(`Setting up real-time notifications for user ${userId}`);
    // Placeholder for real-time setup
  }

  async disconnectRealTimeNotifications(): Promise<void> {
    // This would disconnect WebSocket/SignalR connection
    console.log('Disconnecting real-time notifications');
    // Placeholder for real-time cleanup
  }
}

export const notificationService = new NotificationService();