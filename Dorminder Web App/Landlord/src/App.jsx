import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Tenant from './pages/Tenant';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/tenants" element={<Tenant />} />
            <Route path="/requests" element={<Dashboard />} />
            <Route path="/transactions" element={<Dashboard />} />
            <Route path="/tools-reports" element={<Dashboard />} />
            <Route path="/notifications" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="/logout" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;