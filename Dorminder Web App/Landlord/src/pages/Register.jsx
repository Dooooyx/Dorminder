import React from 'react';
import HeroSection from '../components/HeroSection';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Left Side - Hero Section (50% width) */}
      <HeroSection />

      {/* Right Side - Registration Form (50% width) */}
      <RegisterForm />
    </div>
  );
};

export default Register;
