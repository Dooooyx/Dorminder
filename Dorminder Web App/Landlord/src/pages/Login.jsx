import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/logo/logo_dorminder.png';
import HeroSection from '../components/HeroSection';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { authService } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        // Check if user is a landlord
        if (result.role === 'landlord') {
          navigate('/dashboard');
        } else {
          setError('Access denied. This portal is for landlords only.');
          await authService.signOut();
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await authService.signInWithGoogle();
      
      if (result.success) {
        // Check if user is a landlord
        if (result.role === 'landlord') {
          navigate('/dashboard');
        } else {
          setError('Access denied. This portal is for landlords only.');
          await authService.signOut();
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Left Side - Hero Section (50% width) */}
      <HeroSection />

      {/* Right Side - Login Form (50% width) */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center px-8 py-16 lg:py-0">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-25">
            <img 
              src={logoImage} 
              alt="Dorminder Logo" 
              className="h-24 w-auto"
            />
          </div>

          {/* Form Header */}
          <div className="text-left mb-6">
            <h2 className="text-5xl font-normal text-gray-800">
              Get Started Now
            </h2>
            <p className="text-gray-600 text-base mt-1">
              Please login your account to continue.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-2">
            {/* Email Field */}
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Field */}
            <PasswordField
              id="password"
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Helper Links */}
            <div className="flex justify-between items-center text-[15px]">
              <div className="text-gray-600">
                <span>Don't have an Account? </span>
                <a href="/register" className="text-[#EE6C4D]  hover:text-[#F18A73] hover:underline font-medium">
                  Register
                </a>
              </div>
              <a href="/forgot-password" className="text-gray-400 hover:text-gray-700">
                Forgot password?
              </a>
            </div>

            {/* Primary Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gray-800 text-white rounded-lg text-2xl font-bold hover:bg-gray-900 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Log In'}
            </button>

            {/* OR Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button 
              type="button" 
              disabled={loading}
              className="w-full py-3 bg-white border text-2xl border-gray-200 shadow-md text-gray-800 rounded-lg font-normal hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleLogin}
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                className="w-4 h-4 object-contain"/>
              </div>
              <span>{loading ? 'Signing In...' : 'Log In with Google'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;