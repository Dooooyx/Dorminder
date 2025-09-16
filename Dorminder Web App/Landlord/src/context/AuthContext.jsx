import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.addAuthStateListener((currentUser, userRole) => {
      setUser(currentUser);
      setRole(userRole);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isLandlord: role === 'landlord',
    isTenant: role === 'tenant',
    isAdmin: role === 'admin',
    authService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
