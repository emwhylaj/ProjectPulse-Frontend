import {
  User,
  Project,
  Task,
  TaskComment,
  Notification,
  ProjectActivity,
  ProjectMember,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  ProjectStatus,
  UserRole,
  NotificationType,
  ActivityType,
  PaginatedResponse,
} from '@/types';

import {
  dummyUsers,
  dummyProjects,
  dummyTasks,
  dummyTaskComments,
  dummyNotifications,
  dummyProjectActivities,
  dummyProjectMembers,
  dummyDashboardStats,
  dummyUserStats,
} from '@/data/dummyData';

// Mock API delay to simulate network requests
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication state
let currentUser: User | null = dummyUsers[0]; // Default to admin user

export class MockApiService {
  // Authentication
  async login(email: string, password: string) {
    await mockDelay();
    const user = dummyUsers.find(u => u.email === email);
    
    if (user && password === 'password') { // Simple mock password
      currentUser = user;
      return {
        success: true,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user,
        message: 'Login successful'
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials',
      errors: ['Email or password is incorrect']
    };
  }

  async register(data: any) {
    await mockDelay();
    const newUser: User = {
      id: dummyUsers.length + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: UserRole.TeamMember,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    dummyUsers.push(newUser);
    currentUser = newUser;
    
    return {
      success: true,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: newUser,
      message: 'Registration successful'
    };
  }

  async getCurrentUser() {
    await mockDelay(200);
    return currentUser;
  }

  // Users
  async getAllUsers(): Promise<User[]> {
    await mockDelay();
    return dummyUsers;
  }

  async getUserById(id: number): Promise<User> {
    await mockDelay();
    const user = dummyUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    await mockDelay();
    return dummyUsers.filter(u => u.role === role);
  }

  async getActiveUsers(): Promise<User[]> {
    await mockDelay();
    return dummyUsers.filter(u => u.isActive);
  }

  async getUserStats(userId: number) {
    await mockDelay();
    // Return different stats based on user
    const userTasks = dummyTasks.filter(t => t.assignedToId === userId);
    const userProjects = dummyProjects.filter(p => 
      p.projectManagerId === userId || 
      dummyProjectMembers.some(m => m.userId === userId && m.projectId === p.id)
    );
    
    return {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter(p => p.status === ProjectStatus.InProgress).length,
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(t => t.status === TaskStatus.Completed).length,
      overdueTasks: userTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Completed).length,
      taskCompletionRate: userTasks.length > 0 ? (userTasks.filter(t => t.status === TaskStatus.Completed).length / userTasks.length) * 100 : 0,
    };
  }

  async getMyStats() {
    await mockDelay();
    if (!currentUser) return dummyUserStats;
    return this.getUserStats(currentUser.id);
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    await mockDelay();
    return dummyProjects;
  }

  async getProjectById(id: number): Promise<Project> {
    await mockDelay();
    const project = dummyProjects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async getProjectWithDetails(id: number): Promise<Project> {
    await mockDelay();
    const project = dummyProjects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    
    // Include full details
    return {
      ...project,
      tasks: dummyTasks.filter(t => t.projectId === id),
      members: dummyProjectMembers.filter(m => m.projectId === id),
    };
  }

  async getMyProjects(): Promise<Project[]> {
    await mockDelay();
    if (!currentUser) return [];
    
    return dummyProjects.filter(p => 
      p.projectManagerId === currentUser!.id || 
      dummyProjectMembers.some(m => m.userId === currentUser!.id && m.projectId === p.id)
    );
  }

  async getProjectsByStatus(status: ProjectStatus): Promise<Project[]> {
    await mockDelay();
    return dummyProjects.filter(p => p.status === status);
  }

  async getOverdueProjects(): Promise<Project[]> {
    await mockDelay();
    return dummyProjects.filter(p => new Date(p.endDate) < new Date() && p.status !== ProjectStatus.Completed);
  }

  async getProjectStatusCounts(): Promise<Record<ProjectStatus, number>> {
    await mockDelay();
    const counts = {} as Record<ProjectStatus, number>;
    
    Object.values(ProjectStatus).forEach(status => {
      counts[status] = dummyProjects.filter(p => p.status === status).length;
    });
    
    return counts;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    await mockDelay();
    
    const newProject: Project = {
      id: dummyProjects.length + 1,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      status: ProjectStatus.Planning,
      budget: data.budget,
      actualCost: 0,
      color: data.color || '#3B82F6',
      priority: data.priority,
      projectManagerId: data.projectManagerId,
      projectManager: dummyUsers.find(u => u.id === data.projectManagerId)!,
      tasks: [],
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dummyProjects.push(newProject);
    return newProject;
  }

  async updateProject(id: number, data: UpdateProjectRequest): Promise<Project> {
    await mockDelay();
    
    const projectIndex = dummyProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) throw new Error('Project not found');
    
    const updatedProject = {
      ...dummyProjects[projectIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    if (data.projectManagerId) {
      updatedProject.projectManager = dummyUsers.find(u => u.id === data.projectManagerId)!;
    }
    
    dummyProjects[projectIndex] = updatedProject;
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await mockDelay();
    const index = dummyProjects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    dummyProjects.splice(index, 1);
  }

  // Project Members
  async getProjectMembers(projectId: number): Promise<ProjectMember[]> {
    await mockDelay();
    return dummyProjectMembers.filter(m => m.projectId === projectId);
  }

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    await mockDelay();
    return dummyTasks;
  }

  async getTaskById(id: number): Promise<Task> {
    await mockDelay();
    const task = dummyTasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return task;
  }

  async getMyTasks(status?: TaskStatus): Promise<Task[]> {
    await mockDelay();
    if (!currentUser) return [];
    
    let tasks = dummyTasks.filter(t => t.assignedToId === currentUser!.id);
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    return tasks;
  }

  async getProjectTasks(projectId: number): Promise<Task[]> {
    await mockDelay();
    return dummyTasks.filter(t => t.projectId === projectId);
  }

  async getOverdueTasks(): Promise<Task[]> {
    await mockDelay();
    return dummyTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Completed);
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    await mockDelay();
    return dummyTasks.filter(t => t.status === status);
  }

  async getTaskStatusCounts(projectId?: number): Promise<Record<TaskStatus, number>> {
    await mockDelay();
    let tasks = dummyTasks;
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId);
    }
    
    const counts = {} as Record<TaskStatus, number>;
    Object.values(TaskStatus).forEach(status => {
      counts[status] = tasks.filter(t => t.status === status).length;
    });
    
    return counts;
  }

  async getTasksDueSoon(days: number = 3): Promise<Task[]> {
    await mockDelay();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return dummyTasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate <= futureDate && dueDate >= new Date() && t.status !== TaskStatus.Completed;
    });
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    await mockDelay();
    
    const newTask: Task = {
      id: dummyTasks.length + 1,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: TaskStatus.ToDo,
      dueDate: data.dueDate,
      estimatedHours: data.estimatedHours,
      actualHours: 0,
      projectId: data.projectId,
      project: dummyProjects.find(p => p.id === data.projectId)!,
      assignedToId: data.assignedToId,
      assignedTo: dummyUsers.find(u => u.id === data.assignedToId)!,
      parentTaskId: data.parentTaskId,
      tags: data.tags,
      progress: 0,
      comments: [],
      subTasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dummyTasks.push(newTask);
    return newTask;
  }

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    await mockDelay();
    
    const taskIndex = dummyTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...dummyTasks[taskIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    if (data.assignedToId) {
      updatedTask.assignedTo = dummyUsers.find(u => u.id === data.assignedToId)!;
    }
    
    dummyTasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<{ message: string }> {
    await mockDelay();
    await this.updateTask(taskId, { status });
    return { message: 'Task status updated successfully' };
  }

  async updateTaskProgress(taskId: number, progress: number): Promise<{ message: string }> {
    await mockDelay();
    await this.updateTask(taskId, { progress });
    return { message: 'Task progress updated successfully' };
  }

  async deleteTask(id: number): Promise<void> {
    await mockDelay();
    const index = dummyTasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    dummyTasks.splice(index, 1);
  }

  // Task Comments
  async getTaskComments(taskId: number): Promise<TaskComment[]> {
    await mockDelay();
    return dummyTaskComments.filter(c => c.taskId === taskId);
  }

  async addTaskComment(taskId: number, content: string): Promise<TaskComment> {
    await mockDelay();
    
    const newComment: TaskComment = {
      id: dummyTaskComments.length + 1,
      taskId,
      userId: currentUser!.id,
      user: currentUser!,
      content,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dummyTaskComments.push(newComment);
    return newComment;
  }

  // Notifications
  async getMyNotifications(
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedResponse<Notification>> {
    await mockDelay();
    
    if (!currentUser) {
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
      };
    }
    
    let notifications = dummyNotifications.filter(n => n.userId === currentUser!.id);
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.isRead);
    }
    
    const total = notifications.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: notifications.slice(startIndex, endIndex),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    await mockDelay();
    if (!currentUser) return [];
    return dummyNotifications.filter(n => n.userId === currentUser!.id && !n.isRead);
  }

  async getNotificationCounts() {
    await mockDelay();
    if (!currentUser) return { total: 0, unread: 0, byType: {} };
    
    const userNotifications = dummyNotifications.filter(n => n.userId === currentUser!.id);
    const unread = userNotifications.filter(n => !n.isRead);
    
    const byType = {} as Record<NotificationType, number>;
    Object.values(NotificationType).forEach(type => {
      byType[type] = userNotifications.filter(n => n.type === type).length;
    });
    
    return {
      total: userNotifications.length,
      unread: unread.length,
      byType,
    };
  }

  async markAsRead(id: number): Promise<{ message: string }> {
    await mockDelay();
    const notification = dummyNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
    }
    return { message: 'Notification marked as read' };
  }

  // Activities
  async getRecentActivities(
    limit: number = 20,
    projectId?: number,
    userId?: number
  ): Promise<ProjectActivity[]> {
    await mockDelay();
    
    let activities = [...dummyProjectActivities];
    
    if (projectId) {
      activities = activities.filter(a => a.projectId === projectId);
    }
    
    if (userId) {
      activities = activities.filter(a => a.userId === userId);
    }
    
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getProjectActivities(
    projectId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<ProjectActivity>> {
    await mockDelay();
    
    const activities = dummyProjectActivities.filter(a => a.projectId === projectId);
    const total = activities.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(startIndex, endIndex),
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  // Dashboard Stats
  async getDashboardStats() {
    await mockDelay();
    return dummyDashboardStats;
  }

  // Search functionality
  async searchProjects(searchTerm: string): Promise<Project[]> {
    await mockDelay();
    return dummyProjects.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async searchTasks(searchTerm: string, projectId?: number): Promise<Task[]> {
    await mockDelay();
    let tasks = dummyTasks;
    
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId);
    }
    
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  async searchUsers(searchTerm: string): Promise<User[]> {
    await mockDelay();
    return dummyUsers.filter(u => 
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

export const mockApiService = new MockApiService();