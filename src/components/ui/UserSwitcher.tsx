import React, { useState } from 'react';
import { dummyUsers } from '@/data/dummyData';
import { switchMockUser } from '@/utils/initMockData';
import { useCurrentUser } from '@/stores/auth.store';

export const UserSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useCurrentUser();

  const handleUserSwitch = (userId: number) => {
    switchMockUser(userId);
    setIsOpen(false);
    // Refresh the page to update all data
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
          title="Switch Demo User"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-80">
            <div className="px-3 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Demo User Switcher</h3>
              <p className="text-xs text-gray-500">Switch between different user roles</p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {dummyUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSwitch(user.id)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors duration-150 ${
                    currentUser?.id === user.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {user.profileImageUrl ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.profileImageUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-blue-600 font-medium">{user.role}</p>
                    </div>
                    {currentUser?.id === user.id && (
                      <div className="flex-shrink-0">
                        <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="px-3 py-2 border-t border-gray-200 mt-2">
              <p className="text-xs text-gray-500">
                💡 This switcher is for demo purposes only. Try different user roles to see how the app behaves.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};