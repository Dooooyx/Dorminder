import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/auth';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();

  // Load user data when user changes
  useEffect(() => {
    const loadUserData = async (retryCount = 0) => {
      if (user) {
        try {
          const result = await authService.getUserProfile(user.uid);
          
          if (result.success) {
            const data = result.data;
            setUserData(data);
            
            // Set the display name from user data
            const middleName = data.middleInitial ? ` ${data.middleInitial}.` : '';
            const displayName = data.displayName || `${data.firstName}${middleName} ${data.lastName}`.trim() || 'User';
            setUserName(displayName);
          } else {
            // If document not found and this is a new user, retry after a short delay
            if (result.error === 'User not found' && retryCount < 3) {
              setTimeout(() => loadUserData(retryCount + 1), 1000);
              return;
            }
            
            // Fallback to display name from auth user
            const fallbackName = user.displayName || 'User';
            setUserName(fallbackName);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          
          // If error and this is a new user, retry after a short delay
          if (retryCount < 3) {
            setTimeout(() => loadUserData(retryCount + 1), 1000);
            return;
          }
          
          // Fallback to display name from auth user
          const fallbackName = user.displayName || 'User';
          setUserName(fallbackName);
        }
      } else {
        setUserName('');
        setUserData(null);
      }
    };

    loadUserData();
  }, [user, refreshTrigger]);

  const updateProfileImage = (image) => {
    setProfileImage(image);
  };

  const updateUserName = (name) => {
    setUserName(name);
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        const result = await authService.getUserProfile(user.uid);
        
        if (result.success) {
          const data = result.data;
          setUserData(data);
          
          // Set the display name from user data
          const middleName = data.middleInitial ? ` ${data.middleInitial}.` : '';
          const displayName = data.displayName || `${data.firstName}${middleName} ${data.lastName}`.trim() || 'User';
          setUserName(displayName);
          return { success: true, data };
        } else {
          console.error('Error refreshing user data:', result.error);
          return { success: false, error: result.error };
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user found' };
  };

  const forceRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    profileImage,
    userName,
    userData,
    updateProfileImage,
    updateUserName,
    refreshUserData,
    forceRefresh
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
