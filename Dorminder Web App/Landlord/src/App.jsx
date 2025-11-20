import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerification from './pages/EmailVerification';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Tenant from './pages/Tenant';
import Requests from './pages/Requests';
import Rules from './pages/Rules';
import Billings from './pages/Billings';
import ToolsReports from './pages/ToolsReports';
import Settings from './pages/Settings';
import SuperAdmin from './pages/SuperAdmin';

// Unauthorized page component
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="text-red-500 text-6xl mb-4">🚫</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-4">
        You don't have permission to access this page. This portal is for landlords only.
      </p>
      <button
        onClick={() => window.location.href = '/login'}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Login
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
            <Route path="/tenants" element={<ProtectedRoute><Tenant /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Billings /></ProtectedRoute>} />
            <Route path="/tools-reports" element={<ProtectedRoute><ToolsReports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/super-admin" element={<ProtectedRoute requiredRole="superadmin"><SuperAdmin /></ProtectedRoute>} />
            <Route path="/logout" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;