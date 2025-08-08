// API Client
export { apiClient, ApiClient } from './api';

// Service Classes
export { AuthService, authService } from './auth.service';
export { UserService, userService } from './user.service';
export { ProjectService, projectService } from './project.service';
export { TaskService, taskService } from './task.service';
export { NotificationService, notificationService } from './notification.service';
export { ActivityService, activityService } from './activity.service';

// Service instances for direct use
import { authService } from './auth.service';
import { userService } from './user.service';
import { projectService } from './project.service';
import { taskService } from './task.service';
import { notificationService } from './notification.service';
import { activityService } from './activity.service';

export const services = {
  auth: authService,
  user: userService,
  project: projectService,
  task: taskService,
  notification: notificationService,
  activity: activityService,
} as const;