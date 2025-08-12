import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout';
import { UserSwitcher, Modal } from '@/components/ui';
import { AddMemberForm } from '@/components/forms';
import { userService } from '@/services';
import { User } from '@/types';

export const Team: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchUsers(); // Refresh the users list
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'ProjectManager': return 'bg-blue-100 text-blue-800';
      case 'TeamMember': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ProjectManager': return 'Project Manager';
      case 'TeamMember': return 'Team Member';
      default: return role;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team</h1>
          <p className="text-gray-600">Manage your team members and their roles.</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'Admin').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Managers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'ProjectManager').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'TeamMember').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Directory */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Team Directory</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Member
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  {user.profileImageUrl ? (
                    <img
                      className="h-20 w-20 rounded-full mx-auto mb-4"
                      src={user.profileImageUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-medium text-white">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleName(user.role)}
                  </span>
                  
                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{user.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`inline-flex items-center ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Joined:</span>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Login:</span>
                      <span>{new Date(user.lastLoginAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-center space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                      View Profile
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Member Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Team Member"
          maxWidth="lg"
        >
          <AddMemberForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>

        <UserSwitcher />
      </div>
    </MainLayout>
  );
};