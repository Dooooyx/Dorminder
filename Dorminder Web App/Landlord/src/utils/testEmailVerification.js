// Test script for email verification debugging
import { authService } from '../services/auth';

export const testEmailVerification = async () => {
  console.log('🧪 Testing Email Verification...');
  
  try {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
      console.log('❌ No user logged in');
      return { success: false, error: 'No user logged in' };
    }
    
    console.log('👤 Current user:', currentUser.email);
    console.log('📧 Email verified:', currentUser.emailVerified);
    
    // Test resend verification
    console.log('📤 Attempting to resend verification email...');
    const result = await authService.resendEmailVerification();
    
    if (result.success) {
      console.log('✅ Email verification sent successfully');
      console.log('📧 Check your email inbox and spam folder');
    } else {
      console.log('❌ Failed to send verification email:', result.error);
      
      // Provide specific troubleshooting steps
      if (result.error.includes('too-many-requests')) {
        console.log('💡 Solution: Wait a few minutes before trying again');
      } else if (result.error.includes('invalid-email')) {
        console.log('💡 Solution: Check if email address is valid');
      } else {
        console.log('💡 Solution: Check Firebase Console configuration');
        console.log('   - Go to Firebase Console → Authentication → Settings');
        console.log('   - Check Authorized domains');
        console.log('   - Verify Email/Password is enabled');
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, error: error.message };
  }
};

// Run this in browser console for debugging
export const runEmailVerificationTest = () => {
  console.log('🚀 Starting Email Verification Test...');
  testEmailVerification().then(result => {
    console.log('📊 Test Result:', result);
  });
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.testEmailVerification = runEmailVerificationTest;
  console.log('💡 Run testEmailVerification() in console to test email verification');
}








