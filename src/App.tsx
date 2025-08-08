import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import { LandingPage, Dashboard } from '@/pages';

// Auth Components
import { LoginForm, RegisterForm } from '@/components/auth';

// Layout Components
import { ProtectedRoute, AuthGuard } from '@/components/layout';

// Stores
import { useAuthStore } from '@/stores';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { checkAuthState, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check authentication state on app load
    checkAuthState();
  }, [checkAuthState]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <AuthGuard>
                  <LandingPage />
                </AuthGuard>
              } 
            />
            
            <Route 
              path="/login" 
              element={
                <AuthGuard>
                  <LoginForm />
                </AuthGuard>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <AuthGuard>
                  <RegisterForm />
                </AuthGuard>
              } 
            />

            {/* Additional Auth Routes */}
            <Route 
              path="/forgot-password" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Forgot Password</h2>
                    <p className="text-gray-600 mb-4">This feature is coming soon!</p>
                    <button 
                      onClick={() => window.history.back()} 
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              } 
            />
            
            <Route 
              path="/terms" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>
                    <p className="text-gray-600 mb-4">Terms and conditions content will be added here.</p>
                    <button 
                      onClick={() => window.history.back()} 
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              } 
            />
            
            <Route 
              path="/privacy" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
                    <p className="text-gray-600 mb-4">Privacy policy content will be added here.</p>
                    <button 
                      onClick={() => window.history.back()} 
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route 
              path="*" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/" replace />
              } 
            />
          </Routes>

          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;