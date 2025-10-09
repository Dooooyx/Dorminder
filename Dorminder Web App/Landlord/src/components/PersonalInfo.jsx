import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { fileUploadService } from '../services/fileUploadService';

const PersonalInfo = () => {
  const { profileImage, userName, userData, updateProfileImage, updateUserName, refreshUserData } = useProfile();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    middleInitial: userData?.middleInitial || '',
    lastName: userData?.lastName || '',
    email: user?.email || '',
    phoneCode: '+63',
    phoneNumber: userData?.phone || '',
    birthdate: userData?.birthdate || '',
    profileImage: profileImage
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        middleInitial: userData.middleInitial || '',
        lastName: userData.lastName || '',
        email: user?.email || '',
        phoneNumber: userData.phone || '',
        birthdate: userData.birthdate || ''
      }));
    }
  }, [userData, user]);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      const validation = fileUploadService.validateFile(file);
      if (!validation.isValid) {
        alert(`Invalid file: ${validation.errors.join(', ')}`);
        return;
      }

      setIsUploading(true);
      
      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target.result;
          setFormData(prev => ({
            ...prev,
            profileImage: imageData
          }));
          updateProfileImage(imageData);
        };
        reader.readAsDataURL(file);
        
        // Store file for upload when save is clicked
        setUploadedFile(file);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      let profileImageUrl = formData.profileImage;
      
      // Upload profile picture if a new file was selected
      if (uploadedFile) {
        console.log('Uploading profile picture...');
        const uploadResult = await fileUploadService.uploadProfileImage(uploadedFile, user.uid);
        
        if (uploadResult.success) {
          profileImageUrl = uploadResult.downloadURL;
          console.log('Profile picture uploaded successfully:', profileImageUrl);
        } else {
          console.error('Error uploading profile picture:', uploadResult.error);
          alert('Error uploading profile picture. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      // Update user profile in Firestore
      const { authService } = await import('../services/auth');
      const profileData = {
        firstName: formData.firstName,
        middleInitial: formData.middleInitial,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        birthdate: formData.birthdate
      };

      // Add profile image URL if it was uploaded or if it's already a URL (not base64)
      if (profileImageUrl && !profileImageUrl.startsWith('data:')) {
        profileData.profileImageUrl = profileImageUrl;
      }

      const result = await authService.updateUserProfile(user.uid, profileData);

      if (result.success) {
        // Update profile image in context if it was uploaded
        if (profileImageUrl && !profileImageUrl.startsWith('data:')) {
          updateProfileImage(profileImageUrl);
        }
        
        // Small delay to ensure Firestore update has propagated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Refresh user data from Firestore to get the latest information
        const refreshResult = await refreshUserData();
        if (refreshResult.success) {
          setIsEditing(false);
          setUploadedFile(null); // Clear uploaded file
          console.log('Personal info and profile picture saved successfully');
          alert('Profile updated successfully!');
        } else {
          // Fallback: manually update the display name
          const middleName = formData.middleInitial ? ` ${formData.middleInitial}.` : '';
          const fullName = `${formData.firstName}${middleName} ${formData.lastName}`.trim();
          updateUserName(fullName);
          setIsEditing(false);
          setUploadedFile(null); // Clear uploaded file
          console.log('Personal info saved successfully (manual update)');
          alert('Profile updated successfully!');
        }
      } else {
        console.error('Error saving personal info:', result.error);
        alert('Error saving personal info. Please try again.');
      }
    } catch (error) {
      console.error('Error saving personal info:', error);
      alert('Error saving personal info. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        middleInitial: userData.middleInitial || '',
        lastName: userData.lastName || '',
        email: user?.email || '',
        phoneCode: '+63',
        phoneNumber: userData.phone || '',
        birthdate: userData.birthdate || '',
        profileImage: profileImage
      });
    }
    setUploadedFile(null); // Clear uploaded file
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Info</h2>
          <p className="text-gray-600 mt-1">Update your personal details</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Photo</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.profileImage ? (
                <img 
                  src={formData.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
              <label
                htmlFor="profileImage"
                className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors inline-block ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? 'Processing...' : 'Upload Image'}
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Middle Initial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Middle Initial</label>
            <input
              type="text"
              name="middleInitial"
              value={formData.middleInitial}
              onChange={handleInputChange}
              disabled={!isEditing}
              maxLength="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone No.</label>
            <div className="flex">
              <select
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="+63">+63</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* Birthdate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <div className="pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
