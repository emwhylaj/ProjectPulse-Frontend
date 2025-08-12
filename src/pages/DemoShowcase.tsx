import React, { useEffect, useState } from 'react';
import { useCurrentUser } from '@/stores';
import { UserSwitcher } from '@/components/ui';
import { MainLayout } from '@/components/layout';
import { 
  projectService, 
  taskService, 
  userService, 
  notificationService,
  activityService 
} from '@/services';
import { 
  Project, 
  Task, 
  User, 
  Notification, 
  ProjectActivity
} from '@/types';

export const DemoShowcase: React.FC = () => {
  const currentUser = useCurrentUser();
  const [data, setData] = useState<{
    projects: Project[];
    tasks: Task[];
    users: User[];
    notifications: Notification[];
    activities: ProjectActivity[];
    stats: any;
  }>({
    projects: [],
    tasks: [],
    users: [],
    notifications: [],
    activities: [],
    stats: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [projects, tasks, users, notifications, activities, stats] = await Promise.all([
          projectService.getAllProjects(),
          taskService.getAllTasks(),
          userService.getAllUsers(),
          notificationService.getMyNotifications(),
          activityService.getRecentActivities(),
          userService.getMyStats(),
        ]);

        setData({
          projects,
          tasks,
          users,
          notifications: notifications.data || [],
          activities,
          stats,
        });
      } catch (error) {
        console.error('Failed to fetch showcase data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ProjectPulse Demo Showcase
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Welcome, {currentUser?.firstName}! You are logged in as a {currentUser?.role}.
          </p>
          <p className="text-gray-600">
            This page showcases all the dummy data and features available in the application. 
            Use the user switcher in the bottom right to test different user roles and permissions.
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{data.stats?.totalProjects || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-green-600">{data.stats?.activeProjects || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-purple-600">{data.stats?.totalTasks || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Task Completion Rate</h3>
            <p className="text-3xl font-bold text-orange-600">{Math.round(data.stats?.taskCompletionRate || 0)}%</p>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Projects ({data.projects.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>Manager: {project.projectManager.firstName} {project.projectManager.lastName}</span>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">{project.priority}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Budget: ${project.budget.toLocaleString()}</span>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800">{project.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Tasks ({data.tasks.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description.substring(0, 80)}...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress: {task.progress}%</span>
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">{task.priority}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Assigned: {task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800">{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Team Members ({data.users.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.users.map((user) => (
                <div key={user.id} className="text-center p-4 border border-gray-200 rounded-lg">
                  {user.profileImageUrl ? (
                    <img
                      className="h-16 w-16 rounded-full mx-auto mb-3"
                      src={user.profileImageUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-medium text-gray-700">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  )}
                  <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                  <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Demo Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Available User Roles:</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• <strong>Admin:</strong> Full access to all features</li>
                <li>• <strong>Project Manager:</strong> Can manage projects and tasks</li>
                <li>• <strong>Team Member:</strong> Can view assigned tasks and projects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Features Demonstrated:</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• User authentication with different roles</li>
                <li>• Project management with status tracking</li>
                <li>• Task assignment and progress monitoring</li>
                <li>• Real-time notifications system</li>
                <li>• Activity feed and audit trail</li>
                <li>• Role-based access control</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded border border-blue-200">
            <p className="text-blue-800">
              <strong>💡 Tip:</strong> Use the floating user switcher button in the bottom-right corner 
              to quickly switch between different user accounts and see how the application behaves 
              for different roles and permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Demo User Switcher */}
      <UserSwitcher />
      </div>
    </MainLayout>
  );
};