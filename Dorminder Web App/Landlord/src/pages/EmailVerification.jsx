import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import { bypassEmailVerification } from '../utils/emailVerificationBypass';

const EmailVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isBypassing, setIsBypassing] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  useEffect(() => {
    // Check if email is already verified
    if (user && user.emailVerified) {
      setIsVerified(true);
      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [user, navigate]);

  // Periodically check verification status (every 5 seconds)
  useEffect(() => {
    if (!user || user.emailVerified) return;

    const checkVerification = async () => {
      setIsCheckingVerification(true);
      await user.reload(); // Refresh user data from Firebase
      setIsCheckingVerification(false);
      
      if (user.emailVerified) {
        setIsVerified(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    };

    const interval = setInterval(checkVerification, 5000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');
    
    const result = await authService.resendEmailVerification();
    
    if (result.success) {
      setResendMessage('Verification email sent! Please check your inbox.');
    } else {
      setResendMessage('Failed to send verification email. Please try again.');
    }
    
    setIsResending(false);
  };

  const handleRefresh = async () => {
    setIsCheckingVerification(true);
    if (user) {
      await user.reload(); // Refresh user data from Firebase
      if (user.emailVerified) {
        setIsVerified(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setResendMessage('Email not verified yet. Please check your inbox.');
      }
    }
    setIsCheckingVerification(false);
  };

  const handleBypass = async () => {
    setIsBypassing(true);
    setResendMessage('');
    
    const result = await bypassEmailVerification();
    
    if (result.success) {
      setResendMessage('Email verification bypassed for development! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setResendMessage('Failed to bypass verification. Please try again.');
    }
    
    setIsBypassing(false);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: 'Newsreader, serif', backgroundColor: '#F0F5FA' }}>
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Email Verified!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been successfully verified. You can now access your dashboard.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Go to Dashboard
              </button>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Redirecting automatically...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: 'Newsreader, serif' }}>
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to <strong>{user?.email}</strong>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please check your email and click the verification link to activate your account.
          </p>
          {isCheckingVerification && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking verification status...
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or
            </p>
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="text-orange-600 hover:text-orange-500 text-sm font-medium disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>

          {resendMessage && (
            <div className={`text-center text-sm ${
              resendMessage.includes('sent') ? 'text-green-600' : 'text-red-600'
            }`}>
              {resendMessage}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already verified?
            </p>
            <button
              onClick={handleRefresh}
              disabled={isCheckingVerification}
              className="text-orange-600 hover:text-orange-500 text-sm font-medium disabled:opacity-50"
            >
              {isCheckingVerification ? 'Checking...' : 'Check verification status'}
            </button>
          </div>

          {/* Development Bypass Button */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Development Mode</p>
              <button
                onClick={handleBypass}
                disabled={isBypassing}
                className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 disabled:opacity-50"
              >
                {isBypassing ? 'Bypassing...' : 'Bypass Email Verification (Dev Only)'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
