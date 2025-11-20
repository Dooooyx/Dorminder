import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/logo/logo_dorminder.png';
import InputField from './InputField';
import PasswordField from './PasswordField';
import PhoneNumberField from './PhoneNumberField';
import CheckboxField from './CheckboxField';
import TermsModal from './TermsModal';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dormName: '',
    dormAddress: '',
    subscriptionPlan: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const { authService } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Check password match when confirm password changes
    if (field === 'confirmPassword') {
      if (e.target.value && e.target.value !== formData.password) {
        setPasswordMatchError('Passwords do not match');
      } else {
        setPasswordMatchError('');
      }
    }

    // Check password match when password changes
    if (field === 'password') {
      if (formData.confirmPassword && e.target.value !== formData.confirmPassword) {
        setPasswordMatchError('Passwords do not match');
      } else {
        setPasswordMatchError('');
      }
    }

    // Validate phone number
    if (field === 'phoneNumber') {
      const phoneNumber = e.target.value;
      if (phoneNumber && phoneNumber.length !== 13) {
        setPhoneError('Phone number must be in format +63XXXXXXXXX');
      } else if (phoneNumber && !phoneNumber.startsWith('+63')) {
        setPhoneError('Phone number must start with +63');
      } else {
        setPhoneError('');
      }
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    return {
      isValid: metRequirements >= 4 && requirements.length,
      requirements,
      strength: metRequirements < 3 ? 'weak' : metRequirements < 4 ? 'fair' : metRequirements < 5 ? 'good' : 'strong'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError('Password must be at least 12 characters with uppercase, lowercase, numbers, and special characters');
      setLoading(false);
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setPasswordMatchError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Phone number validation
    if (formData.phoneNumber && (formData.phoneNumber.length !== 13 || !formData.phoneNumber.startsWith('+63'))) {
      setError('Phone number must be in format +63XXXXXXXXX');
      setPhoneError('Phone number must be in format +63XXXXXXXXX');
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError('Please accept the Terms & Privacy Policy');
      setLoading(false);
      return;
    }

    // Subscription plan validation
    if (!formData.subscriptionPlan) {
      setError('Please select a subscription plan');
      setLoading(false);
      return;
    }

    // Calculate expiration date based on subscription plan
    const calculateExpirationDate = (plan) => {
      const today = new Date();
      const expirationDate = new Date(today);
      
      switch (plan) {
        case '3 months':
          expirationDate.setMonth(today.getMonth() + 3);
          break;
        case '6 months':
          expirationDate.setMonth(today.getMonth() + 6);
          break;
        case 'Annual':
          expirationDate.setFullYear(today.getFullYear() + 1);
          break;
        default:
          expirationDate.setMonth(today.getMonth() + 3);
      }
      
      return expirationDate;
    };

    try {
      const expirationDate = calculateExpirationDate(formData.subscriptionPlan);
      
      const result = await authService.register(formData.email, formData.password, {
        firstName: formData.firstName,
        middleInitial: formData.middleInitial,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        role: 'landlord', // Set as landlord for this portal
        dormName: formData.dormName,
        dormAddress: formData.dormAddress,
        subscriptionPlan: formData.subscriptionPlan,
        subscriptionExpirationDate: expirationDate,
        // Use the same email and password for sending tenant emails
        systemEmail: formData.email,
        systemEmailPassword: formData.password
      });

      if (result.success) {
        if (result.needsVerification) {
          // Redirect to email verification page
          navigate('/email-verification');
        } else {
          navigate('/dashboard');
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

  const handleTermsClick = (e) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  const handleAcceptTerms = (isChecked) => {
    setAgreeToTerms(isChecked);
    console.log('Terms accepted:', isChecked);
  };

  const handleDeclineTerms = () => {
    setAgreeToTerms(false);
    console.log('Terms declined');
  };

  return (
    <div className="lg:w-1/2 bg-white flex items-center justify-center px-8 py-16 lg:py-0">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src={logoImage} 
            alt="Dorminder Logo" 
            className="h-24 w-auto"
          />
        </div>

        {/* Form Header */}
        <div className="text-left mb-8">
          <h2 className="text-5xl font-normal text-gray-800 mb-2">
            Create an account
          </h2>
          <p className="text-gray-600 text-base text-[20px]">
            Already have an Account? <a href="/login" className="text-[#EE6C4D] hover:text-[#F18A73] hover:underline font-medium">Log In</a>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields - Three columns */}
          <div className="grid grid-cols-3 gap-4">
            <InputField
              id="firstName"
              label="First Name"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              required
              showLabel={false}
            />
            <InputField
              id="middleInitial"
              label="Middle Initial (Optional)"
              placeholder="M.I."
              value={formData.middleInitial}
              onChange={handleInputChange('middleInitial')}
              showLabel={false}
            />
            <InputField
              id="lastName"
              label="Last Name"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              required
              showLabel={false}
            />
          </div>

          {/* Email Field */}
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            showLabel={false}
          />

          {/* Password Field */}
          <PasswordField
            id="password"
            label="Password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            showLabel={false}
            showStrengthIndicator={true}
          />

          {/* Confirm Password Field */}
          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            required
            showLabel={false}
          />
          
          {/* Password Match Error */}
          {passwordMatchError && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {passwordMatchError}
            </div>
          )}

          {/* Phone Number Field */}
          <PhoneNumberField
            id="phoneNumber"
            label="Phone Number"
            placeholder="09XX-XXX-YYYY"
            value={formData.phoneNumber}
            onChange={handleInputChange('phoneNumber')}
            required
            showLabel={false}
          />
          
          {/* Phone Number Error */}
          {phoneError && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {phoneError}
            </div>
          )}

          {/* Dorm Name Field */}
          <InputField
            id="dormName"
            label="Boarding House/Dorm Name"
            placeholder="Boarding House/Dorm Name"
            value={formData.dormName}
            onChange={handleInputChange('dormName')}
            required
            showLabel={false}
          />

          {/* Dorm Address Field */}
          <InputField
            id="dormAddress"
            label="Boarding House/Dorm Address"
            placeholder="Boarding House/Dorm Address"
            value={formData.dormAddress}
            onChange={handleInputChange('dormAddress')}
            required
            showLabel={false}
          />

          {/* Subscription Plan Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subscription Plan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: '3 months' }))}
                className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                  formData.subscriptionPlan === '3 months'
                    ? 'border-[#3D5A80] bg-[#3D5A80] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                3 Months
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: '6 months' }))}
                className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                  formData.subscriptionPlan === '6 months'
                    ? 'border-[#3D5A80] bg-[#3D5A80] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                6 Months
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: 'Annual' }))}
                className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                  formData.subscriptionPlan === 'Annual'
                    ? 'border-[#3D5A80] bg-[#3D5A80] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Terms & Privacy Checkbox */}
          <CheckboxField
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-6 flex justify-center items-center"
          >
            I agree to the <button onClick={handleTermsClick} className="text-[#3D5A80] hover:text-[#192534] underline cursor-pointer">Terms & Privacy Policy</button>
          </CheckboxField>

          {/* Register Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gray-800 text-white rounded-lg text-2xl font-bold shadow-md hover:bg-gray-900 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Terms Modal */}
        <TermsModal 
          isOpen={isTermsModalOpen} 
          onClose={() => setIsTermsModalOpen(false)}
          isAgreed={agreeToTerms}
          onAccept={handleAcceptTerms}
          onDecline={handleDeclineTerms}
        />
      </div>
    </div>
  );
};

export default RegisterForm;
