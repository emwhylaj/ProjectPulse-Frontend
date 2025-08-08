// User types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
  profileImageUrl?: string;
  lastLoginAt: string;
  createdAt: string;
}

export enum UserRole {
  Admin = 'Admin',
  ProjectManager = 'ProjectManager',
  TeamMember = 'TeamMember'
}

// Project types
export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  budget: number;
  actualCost?: number;
  color?: string;
  priority?: ProjectPriority;
  projectManagerId: number;
  projectManager: User;
  tasks: Task[];
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  Planning = 'Planning',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum ProjectPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface ProjectMember {
  id: number;
  projectId: number;
  userId: number;
  user: User;
  role: ProjectMemberRole;
  joinedAt: string;
  isActive: boolean;
}

export enum ProjectMemberRole {
  ProjectManager = 'ProjectManager',
  Developer = 'Developer',
  Designer = 'Designer',
  QA = 'QA',
  BusinessAnalyst = 'BusinessAnalyst'
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  projectId: number;
  project: Project;
  assignedToId: number;
  assignedTo: User;
  parentTaskId?: number;
  parentTask?: Task;
  subTasks: Task[];
  tags: string;
  progress: number;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  NotStarted = 'NotStarted',
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Review = 'Review',
  Completed = 'Completed',
  Blocked = 'Blocked',
  Cancelled = 'Cancelled',
  OnHold = 'OnHold'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface TaskComment {
  id: number;
  taskId: number;
  userId: number;
  user: User;
  content: string;
  parentCommentId?: number;
  parentComment?: TaskComment;
  replies: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export enum NotificationType {
  TaskAssigned = 'TaskAssigned',
  TaskCompleted = 'TaskCompleted',
  TaskStatusChanged = 'TaskStatusChanged',
  ProjectUpdated = 'ProjectUpdated',
  ProjectMemberAdded = 'ProjectMemberAdded',
  TaskCommentAdded = 'TaskCommentAdded',
  TaskDueSoon = 'TaskDueSoon',
  DeadlineReminder = 'DeadlineReminder',
  CommentAdded = 'CommentAdded',
  ProjectInvitation = 'ProjectInvitation',
  StatusChanged = 'StatusChanged',
  FileUploaded = 'FileUploaded'
}

// Activity types
export interface ProjectActivity {
  id: number;
  projectId: number;
  project: Project;
  userId: number;
  user: User;
  activityType: ActivityType;
  description: string;
  entityType?: string;
  entityId?: number;
  oldValues?: string;
  newValues?: string;
  createdAt: string;
}

export enum ActivityType {
  ProjectCreated = 'ProjectCreated',
  ProjectUpdated = 'ProjectUpdated',
  TaskCreated = 'TaskCreated',
  TaskUpdated = 'TaskUpdated',
  TaskCompleted = 'TaskCompleted',
  TaskStatusChanged = 'TaskStatusChanged',
  TaskAssigned = 'TaskAssigned',
  MemberAdded = 'MemberAdded',
  MemberRemoved = 'MemberRemoved',
  CommentAdded = 'CommentAdded',
  FileUploaded = 'FileUploaded',
  StatusChanged = 'StatusChanged'
}

// Auth types
export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
  errors?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form types
export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  priority?: ProjectPriority;
  color?: string;
  projectManagerId: number;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: ProjectStatus;
  budget?: number;
  actualCost?: number;
  priority?: ProjectPriority;
  color?: string;
  projectManagerId?: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  estimatedHours: number;
  projectId: number;
  assignedToId: number;
  parentTaskId?: number;
  tags: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignedToId?: number;
  parentTaskId?: number;
  tags?: string;
  progress?: number;
}

// Error types
export interface ApiError {
  message: string;
  statusCode: number;
  errorType: string;
  details?: string;
  timestamp: string;
  path?: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Filter and sort types
export interface ProjectFilters {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  managerId?: number;
  search?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: number;
  projectId?: number;
  search?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}