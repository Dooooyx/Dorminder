// Temporary bypass for email verification during development
// Remove this file in production

import { authService } from '../services/auth';

export const bypassEmailVerification = async () => {
  try {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // Force email verification status to true
      await currentUser.reload();
      
      // Update user document to mark as verified
      await authService.updateUserProfile(currentUser.uid, {
        emailVerified: true
      });
      
      console.log('Email verification bypassed for development');
      return { success: true, message: 'Email verification bypassed' };
    }
    return { success: false, error: 'No user logged in' };
  } catch (error) {
    console.error('Bypass error:', error);
    return { success: false, error: error.message };
  }
};

// Add this to your EmailVerification component for development
export const addBypassButton = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      showBypass: true,
      bypassFunction: bypassEmailVerification
    };
  }
  return { showBypass: false };
};







