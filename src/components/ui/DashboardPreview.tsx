import React, { useState } from 'react';
import { dummyProjects, dummyTasks, dummyUsers } from '@/data/dummyData';

export const DashboardPreview: React.FC = () => {
  const [stats] = useState(() => ({
    totalProjects: dummyProjects.length,
    activeProjects: dummyProjects.filter(p => p.status === 'InProgress').length,
    totalTasks: dummyTasks.length,
    completedTasks: dummyTasks.filter(t => t.status === 'Completed').length,
    overdueTasks: dummyTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length,
    teamMembers: dummyUsers.length,
  }));

  const recentProjects = dummyProjects.slice(0, 3);
  const recentTasks = dummyTasks.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Welcome back, John!</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H21M7 10V12H9V10M11 10V12H13V10M15 10V12H17V10M19 10V12H21V10Z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
          <div className="text-xs text-blue-700 font-medium">Projects</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
          <div className="text-xs text-green-700 font-medium">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.activeProjects}</div>
          <div className="text-xs text-yellow-700 font-medium">Active</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
          <div className="text-xs text-red-700 font-medium">Overdue</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Recent Projects */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Projects</h3>
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-900 truncate">{project.name}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${ 
                  project.status === 'InProgress' 
                    ? 'bg-blue-100 text-blue-700' 
                    : project.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {project.status === 'InProgress' ? 'Active' : project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Tasks</h3>
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900 truncate">{task.title}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                    task.status === 'Completed' 
                      ? 'bg-green-100 text-green-700'
                      : task.status === 'InProgress'
                      ? 'bg-blue-100 text-blue-700'
                      : task.status === 'Review'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.status === 'InProgress' ? 'Active' : task.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full" 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Activity */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: 2 hours ago</span>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Live data</span>
          </div>
        </div>
      </div>
    </div>
  );
};