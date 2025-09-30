import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import PhoneNumberField from './PhoneNumberField';
import { tenantService } from '../services/tenantService';
import { roomService } from '../services/roomService';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const AddTenantModal = ({ isOpen, onClose, onAddTenant }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    contactNumber: '+63 ',
    contactNumberStorage: '',
    emailAddress: '',
    emergencyContactName: '',
    emergencyContactNumber: '+63 ',
    emergencyContactNumberStorage: '',
    accountEmail: '',
    password: '',
    confirmPassword: '',
    selectedRoom: '',
    rentAmount: '',
    initialPaymentStatus: '',
    leaseStartDate: '',
    leaseEndDate: '',
    status: '',
    validIdFile: null,
    leaseContractFile: null
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load vacant rooms when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadVacantRooms();
    }
  }, [isOpen, user]);

  const loadVacantRooms = async () => {
    try {
      setLoadingRooms(true);
      const result = await roomService.getVacantRoomsByProperty(user.uid);
      
      if (result.success) {
        const rooms = result.data.map(room => ({
          value: room.id,
          label: room.roomNumber,
          rent: room.monthlyRent || 0
        }));
        setAvailableRooms(rooms);
      } else {
        console.error('Error loading vacant rooms:', result.error);
        setAvailableRooms([]);
      }
    } catch (error) {
      console.error('Error loading vacant rooms:', error);
      setAvailableRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const paymentStatusOptions = [
    'Paid', 'Unpaid', 'Pending'
  ];

  const statusOptions = [
    'Active', 'Inactive', 'Pending'
  ];

  // Password validation (same as Register page)
  const validatePassword = (pwd) => {
    const errors = [];
    
    if (pwd.length < 12) {
      errors.push("Minimum 12 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("At least 1 uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("At least 1 lowercase letter");
    }
    if (!/\d/.test(pwd)) {
      errors.push("At least 1 number");
    }
    if (!/[!@#$%]/.test(pwd)) {
      errors.push("At least 1 special character (! @ # $ %)");
    }
    
    return errors;
  };

  // Format phone number as user types (same as Register page)
  const formatPhoneAsUserTypes = (input) => {
    // If input starts with +63, keep it and format the rest
    if (input.startsWith('+63')) {
      const digits = input.slice(3).replace(/\D/g, ''); // Get digits after +63
      const limitedDigits = digits.slice(0, 10); // Limit to 10 digits after +63
      
      // Format the digits with spaces: +63 9XXX XXX XXX
      if (limitedDigits.length <= 3) {
        return `+63 ${limitedDigits}`;
      } else if (limitedDigits.length <= 6) {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
      } else {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
      }
    } else {
      // If user types without +63, add it
      const digits = input.replace(/\D/g, '');
      const limitedDigits = digits.slice(0, 10);
      
      if (limitedDigits.length <= 3) {
        return `+63 ${limitedDigits}`;
      } else if (limitedDigits.length <= 6) {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
      } else {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
      }
    }
  };

  // Convert display format to +63 format for storage
  const formatPhoneForStorage = (input) => {
    if (!input) return '';
    
    // Remove all non-digit characters
    const cleanNumber = input.replace(/\D/g, '');
    
    // If it's already in +63 format, return as is
    if (input.startsWith('+63')) {
      return input;
    }
    
    // If it's a local number (starts with 09), convert to +63 format
    if (cleanNumber.startsWith('09') && cleanNumber.length === 11) {
      return '+63' + cleanNumber.slice(1); // Remove 0 and add +63
    }
    
    // If it's 63 format (without +), add the +
    if (cleanNumber.startsWith('63') && cleanNumber.length === 12) {
      return '+' + cleanNumber;
    }
    
    // If it's a valid local number, convert to +63
    if (cleanNumber.length === 11 && cleanNumber.startsWith('09')) {
      return '+63' + cleanNumber.slice(1);
    }
    
    return input; // Return as is if format is unclear
  };

  // Handle password change (same as Register page)
  const handlePasswordChange = (text) => {
    setFormData(prev => ({ ...prev, password: text }));
    
    // Show requirements popup when user starts typing
    if (text.length > 0 && !showPasswordRequirements) {
      setShowPasswordRequirements(true);
    }
    
    // Clear confirm password error when password changes
    if (formData.confirmPassword && text !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords don't match"
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setFormData(prev => ({ ...prev, confirmPassword: text }));
    
    if (formData.password && text !== formData.password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Passwords don't match"
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    
    // Handle phone number formatting for Philippine numbers
    if (field === 'contactNumber' || field === 'emergencyContactNumber') {
      // Format for display with spaces
      const formatted = formatPhoneAsUserTypes(value);
      setFormData(prev => ({
        ...prev,
        [field]: formatted
      }));
      
      // Store in +63 format for validation and storage
      const phoneForStorage = formatPhoneForStorage(formatted);
      setFormData(prev => ({
        ...prev,
        [`${field}Storage`]: phoneForStorage
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Auto-fill rent amount when room is selected
    if (field === 'selectedRoom') {
      const selectedRoomData = availableRooms.find(room => room.value === value);
      if (selectedRoomData) {
        setFormData(prev => ({
          ...prev,
          rentAmount: `₱${selectedRoomData.rent.toLocaleString()}`
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          rentAmount: ''
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.files[0]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Tenant Information validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    // Validate contact number using display format
    const contactNumberClean = formData.contactNumber.replace(/\D/g, '');
    if (!formData.contactNumber.trim() || formData.contactNumber === '+63 ') {
      newErrors.contactNumber = 'Contact number is required';
    } else if (contactNumberClean.length !== 12 || !contactNumberClean.startsWith('63')) {
      newErrors.contactNumber = 'Contact number must be in format +63XXXXXXXXX';
    } else if (!contactNumberClean.startsWith('639')) {
      newErrors.contactNumber = 'Philippine mobile numbers must start with +639';
    }
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }
    // Validate emergency contact number using display format
    const emergencyContactNumberClean = formData.emergencyContactNumber.replace(/\D/g, '');
    if (!formData.emergencyContactNumber.trim() || formData.emergencyContactNumber === '+63 ') {
      newErrors.emergencyContactNumber = 'Emergency contact number is required';
    } else if (emergencyContactNumberClean.length !== 12 || !emergencyContactNumberClean.startsWith('63')) {
      newErrors.emergencyContactNumber = 'Emergency contact number must be in format +63XXXXXXXXX';
    } else if (!emergencyContactNumberClean.startsWith('639')) {
      newErrors.emergencyContactNumber = 'Philippine mobile numbers must start with +639';
    }

    // Account Information validation
    if (!formData.accountEmail.trim()) {
      newErrors.accountEmail = 'Account email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.accountEmail)) {
      newErrors.accountEmail = 'Please enter a valid email address';
    }
    // Password validation (same as Register page)
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0]; // Show first error
      }
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Lease Details validation
    if (!formData.selectedRoom) {
      newErrors.selectedRoom = 'Please select a room';
    }
    if (!formData.initialPaymentStatus) {
      newErrors.initialPaymentStatus = 'Please select initial payment status';
    }
    if (!formData.leaseStartDate) {
      newErrors.leaseStartDate = 'Lease start date is required';
    }
    if (!formData.leaseEndDate) {
      newErrors.leaseEndDate = 'Lease end date is required';
    } else if (formData.leaseStartDate && new Date(formData.leaseEndDate) <= new Date(formData.leaseStartDate)) {
      newErrors.leaseEndDate = 'Lease end date must be after start date';
    }
    if (!formData.status) {
      newErrors.status = 'Please select a status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // Find the selected room details
        const selectedRoom = availableRooms.find(room => room.value === formData.selectedRoom);
        
        // Prepare tenant data for service
        const tenantData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleInitial,
          contactNumber: formData.contactNumberStorage,
          emergencyContact: formData.emergencyContactName,
          emergencyContactNumber: formData.emergencyContactNumberStorage,
          email: formData.accountEmail,
          password: formData.password,
          validIdType: 'Government ID', // Default value
          validIdNumber: formData.validIdNumber || '',
          validIdImage: formData.validIdFile || '',
          propertyId: user.uid, // Use user's UID as propertyId
          roomId: formData.selectedRoom,
          roomNumber: selectedRoom ? selectedRoom.label : '',
          monthlyRent: selectedRoom ? selectedRoom.rent : parseFloat(formData.rentAmount),
          leaseStartDate: formData.leaseStartDate,
          leaseEndDate: formData.leaseEndDate,
          securityDeposit: (selectedRoom ? selectedRoom.rent : parseFloat(formData.rentAmount)) * 2 // 2 months deposit
        };

        // Create tenant using service
        const result = await tenantService.createTenant(tenantData, user?.email);
        
        if (result.success) {
          // Show success popup instead of closing immediately
          setShowSuccessPopup(true);
          // Call the parent callback with the result
          onAddTenant({
            ...tenantData,
            id: result.tenantId,
            userId: result.userId,
            message: result.message
          });
        } else {
          // Handle error
          console.error('Error creating tenant:', result.error);
          alert('Error creating tenant: ' + result.error);
        }
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        alert('Error creating tenant: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      middleInitial: '',
      contactNumber: '+63 ',
      contactNumberStorage: '',
      emailAddress: '',
      emergencyContactName: '',
      emergencyContactNumber: '+63 ',
      emergencyContactNumberStorage: '',
      accountEmail: '',
      password: '',
      confirmPassword: '',
      selectedRoom: '',
      rentAmount: '',
      initialPaymentStatus: '',
      leaseStartDate: '',
      leaseEndDate: '',
      status: '',
      validIdFile: null,
      leaseContractFile: null
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowPasswordRequirements(false);
    setShowSuccessPopup(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Add New Tenant</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Tenant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Initial
                  </label>
                  <input
                    type="text"
                    value={formData.middleInitial}
                    onChange={handleInputChange('middleInitial')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="M"
                    maxLength="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleInputChange('contactNumber')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+63 9XX XXX XXXX"
                    maxLength="17"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleInputChange('emailAddress')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.emailAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange('emergencyContactName')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter emergency contact name"
                  />
                  {errors.emergencyContactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactNumber}
                    onChange={handleInputChange('emergencyContactNumber')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergencyContactNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+63 9XX XXX XXXX"
                    maxLength="17"
                  />
                  {errors.emergencyContactNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyContactNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Account Information</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.accountEmail}
                  onChange={handleInputChange('accountEmail')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.accountEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.accountEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.accountEmail}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              {/* Password Strength Indicator with Visual Bar */}
              {formData.password.length > 0 && (
                <div className="mt-4">
                  <PasswordStrengthIndicator 
                    password={formData.password} 
                    showRequirements={true}
                  />
                </div>
              )}
            </div>

            {/* Lease Details Section - Following the image layout exactly */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Lease Details</h3>
              
              {/* Top Row: Select Room, Rent Amount, Initial Payment Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Room *
                  </label>
                  <select
                    value={formData.selectedRoom}
                    onChange={handleInputChange('selectedRoom')}
                    disabled={loadingRooms}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.selectedRoom ? 'border-red-500' : 'border-gray-300'
                    } ${loadingRooms ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  >
                    <option value="">
                      {loadingRooms ? 'Loading rooms...' : availableRooms.length === 0 ? 'No vacant rooms available' : 'Select a room'}
                    </option>
                    {availableRooms.map(room => (
                      <option key={room.value} value={room.value}>{room.label}</option>
                    ))}
                  </select>
                  {errors.selectedRoom && (
                    <p className="text-red-500 text-sm mt-1">{errors.selectedRoom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Amount (auto-fills from room)
                  </label>
                  <input
                    type="text"
                    value={formData.rentAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    placeholder="₱0.00"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Payment Status *
                  </label>
                  <select
                    value={formData.initialPaymentStatus}
                    onChange={handleInputChange('initialPaymentStatus')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.initialPaymentStatus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select payment status</option>
                    {paymentStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {errors.initialPaymentStatus && (
                    <p className="text-red-500 text-sm mt-1">{errors.initialPaymentStatus}</p>
                  )}
                </div>
              </div>

              {/* Bottom Row: Lease Start Date, Lease End Date, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease Start Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.leaseStartDate}
                      onChange={handleInputChange('leaseStartDate')}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.leaseStartDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.leaseStartDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.leaseStartDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease End Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.leaseEndDate}
                      onChange={handleInputChange('leaseEndDate')}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.leaseEndDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.leaseEndDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.leaseEndDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={handleInputChange('status')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Valid ID
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange('validIdFile')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Lease Contract
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange('leaseContractFile')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Centered */}
            <div className="flex justify-center space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-[#EE6C4D] text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[140px] ${
                  isSubmitting 
                    ? 'bg-[#61BD45] cursor-not-allowed' 
                    : 'bg-[#61BD45] hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Tenant'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm bg-white bg-opacity-20">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ Tenant Registered Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Email verification sent to tenant's email.
            </p>
            <ul className="text-left text-sm text-gray-600 mb-6 space-y-1">
              <li>✅ Email verification sent to tenant's email</li>
              <li>✅ Tenant account created with role: "tenant"</li>
              <li>✅ Tenant can log in using the mobile app after verification</li>
              <li>✅ Landlord session preserved</li>
            </ul>
            <button
              onClick={handleSuccessClose}
              className="w-full px-4 py-2 bg-[#61BD45] text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Tenant List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTenantModal;