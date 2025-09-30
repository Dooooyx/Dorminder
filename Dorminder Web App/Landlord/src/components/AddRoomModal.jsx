import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import { propertyService } from '../services/propertyService';
import { roomService } from '../services/roomService';
import { fileUploadService } from '../services/fileUploadService';
import { useAuth } from '../context/AuthContext';

const AddRoomModal = ({ isOpen, onClose, onAddRoom }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    monthlyRent: '',
    capacity: '',
    description: '',
    amenities: '',
    floor: '',
    bathroom: '',
    airconditioning: '',
    propertyName: '',
    propertyAddress: '',
    utilities: {
      water: false,
      electricity: false,
      internet: false,
      others: false,
      othersText: ''
    },
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Load landlord property information when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPropertyInfo();
    }
  }, [isOpen]);

  const loadPropertyInfo = async () => {
    try {
      const result = await propertyService.getLandlordPropertyInfo();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          propertyName: result.data.propertyName,
          propertyAddress: result.data.propertyAddress
        }));
      }
    } catch (error) {
      console.error('Error loading property info:', error);
    }
  };

  const roomTypes = [
    'Single',
    'Double', 
    'Triple',
    'Quad'
  ];

  const floors = [
    'Ground Floor',
    '1st Floor',
    '2nd Floor', 
    '3rd Floor',
    '4th Floor',
    '5th Floor'
  ];

  const bathroomOptions = [
    'Private',
    'Public'
  ];

  const airconditioningOptions = [
    'With Aircon',
    'Without Aircon'
  ];

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleUtilityChange = (utility) => (e) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utility]: e.target.checked
      }
    }));
  };

  const handleOthersTextChange = (e) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        othersText: e.target.value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadPromises = files.map(async (file) => {
        // Upload to Firebase Storage
        const result = await fileUploadService.uploadFile(file, `room-images/${user.uid}`);
        
        if (result.success) {
          return {
            url: result.downloadURL,
            name: file.name,
            size: file.size
          };
        } else {
          throw new Error(result.error);
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Room type is required';
    }

    if (!formData.monthlyRent.trim()) {
      newErrors.monthlyRent = 'Monthly rent is required';
    } else if (isNaN(formData.monthlyRent) || Number(formData.monthlyRent) <= 0) {
      newErrors.monthlyRent = 'Please enter a valid rent amount';
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
      newErrors.capacity = 'Please enter a valid capacity';
    }

    if (!formData.floor) {
      newErrors.floor = 'Floor is required';
    }

    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'Property name is required';
    }

    if (!formData.propertyAddress.trim()) {
      newErrors.propertyAddress = 'Property address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm() && !isLoading) {
      setIsLoading(true);
      
      try {
        const roomData = {
          propertyId: user.uid,
          roomNumber: formData.roomNumber,
          roomType: formData.roomType,
          monthlyRent: Number(formData.monthlyRent),
          capacity: Number(formData.capacity),
          floor: formData.floor,
          bathroom: formData.bathroom,
          airconditioning: formData.airconditioning,
          description: formData.description,
          amenities: formData.amenities,
          propertyName: formData.propertyName,
          propertyAddress: formData.propertyAddress,
          utilities: formData.utilities,
          images: formData.images
        };
        
        const result = await roomService.createRoom(roomData);
        
        if (result.success) {
          onAddRoom(roomData);
          setShowSuccessMessage(true);
          
          // Auto-hide success message and close modal after 2 seconds
          setTimeout(() => {
            setShowSuccessMessage(false);
          handleClose();
          }, 2000);
        } else {
          console.error('Error creating room:', result.error);
          // Show specific error message for duplicate room numbers
          if (result.error.includes('already exists')) {
            setErrors({ roomNumber: result.error });
          } else {
            alert('Failed to create room. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error creating room:', error);
        alert('Failed to create room. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      roomNumber: '',
      roomType: '',
      monthlyRent: '',
      capacity: '',
      description: '',
      amenities: '',
      floor: '',
      bathroom: '',
      airconditioning: '',
      propertyName: '',
      propertyAddress: '',
      utilities: {
        water: false,
        electricity: false,
        internet: false,
        others: false,
        othersText: ''
      },
      images: []
    });
    setErrors({});
    setIsLoading(false);
    setShowSuccessMessage(false);
    setUploadingImages(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Success Message Popup */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Room Added Successfully!</h3>
            <p className="text-gray-600">The room has been added to your property.</p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        style={{ backdropFilter: 'blur(8px)' }}
        onClick={handleClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Add New Room</h2>
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
            {/* Property Information Section - Moved to Top */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Property Information</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <InputField
                    id="propertyName"
                    label="Boarding House/Dorm Name"
                    placeholder="Enter your property name"
                    value={formData.propertyName}
                    onChange={handleInputChange('propertyName')}
                    required
                    className={errors.propertyName ? 'border-red-500' : ''}
                  />
                  {errors.propertyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>
                  )}
                </div>

                <div>
                  <InputField
                    id="propertyAddress"
                    label="Boarding House/Dorm Address"
                    placeholder="Enter your property address"
                    value={formData.propertyAddress}
                    onChange={handleInputChange('propertyAddress')}
                    required
                    className={errors.propertyAddress ? 'border-red-500' : ''}
                  />
                  {errors.propertyAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.propertyAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Room Details Section */}
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Room Details</h3>
              
              {/* Room Number and Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    id="roomNumber"
                    label="Room Number"
                    placeholder="e.g., Room 101, A-201"
                    value={formData.roomNumber}
                    onChange={handleInputChange('roomNumber')}
                    required
                    className={errors.roomNumber ? 'border-red-500' : ''}
                  />
                  {errors.roomNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xl font-normal text-gray-800 ">
                    Room Type *:
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={handleInputChange('roomType')}
                    className={`w-full px-4 py-4 pr-10 mb-2 text-xl font-normal bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.roomType ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.roomType && (
                    <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
                  )}
                </div>
              </div>

            {/* Monthly Rent and Capacity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField
                  id="monthlyRent"
                  label="Monthly Rent (₱)"
                  type="number"
                  placeholder="5000"
                  value={formData.monthlyRent}
                  onChange={handleInputChange('monthlyRent')}
                  required
                  className={errors.monthlyRent ? 'border-red-500' : ''}
                />
                {errors.monthlyRent && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyRent}</p>
                )}
              </div>

              <div>
                <InputField
                  id="capacity"
                  label="Capacity (persons)"
                  type="number"
                  placeholder="2"
                  value={formData.capacity}
                  onChange={handleInputChange('capacity')}
                  required
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && (
                  <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                )}
              </div>
            </div>

            {/* Floor Row - Full Width */}
            <div>
              <label className="block text-xl font-normal mt-2 text-gray-800">
                Floor:
              </label>
              <select
                value={formData.floor}
                onChange={handleInputChange('floor')}
                className={`w-full px-4 py-4 pr-10 text-xl font-normal bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.floor ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <option value="">Select floor</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>
              {errors.floor && (
                <p className="text-red-500 text-sm mt-1">{errors.floor}</p>
              )}
            </div>

            {/* Bathroom and Airconditioning Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-normal mt-2 text-gray-800">
                  Bathroom:
                </label>
                <select
                  value={formData.bathroom}
                  onChange={handleInputChange('bathroom')}
                  className={`w-full px-4 py-4 pr-10 text-xl font-normal bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.bathroom ? 'ring-2 ring-red-500' : ''
                  }`}
                >
                  <option value="">Select bathroom</option>
                  {bathroomOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.bathroom && (
                  <p className="text-red-500 text-sm mt-1">{errors.bathroom}</p>
                )}
              </div>

              <div>
                <label className="block text-xl font-normal mt-2 text-gray-800">
                  Airconditioning:
                </label>
                <select
                  value={formData.airconditioning}
                  onChange={handleInputChange('airconditioning')}
                  className={`w-full px-4 py-4 pr-10 text-xl font-normal bg-gray-100 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.airconditioning ? 'ring-2 ring-red-500' : ''
                  }`}
                >
                  <option value="">Select airconditioning</option>
                  {airconditioningOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.airconditioning && (
                  <p className="text-red-500 text-sm mt-1">{errors.airconditioning}</p>
                )}
              </div>
            </div>
            </div>

            {/* Utilities Included Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Utilities Included</h3>
              
              <div className="flex flex-wrap gap-6 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.utilities.water}
                    onChange={handleUtilityChange('water')}
                    className="w-4 h-4 text-[#EE6C4D] border-gray-300 rounded focus:ring-[#EE6C4D]"
                  />
                  <span className="text-sm font-medium text-gray-700">Water</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.utilities.electricity}
                    onChange={handleUtilityChange('electricity')}
                    className="w-4 h-4 text-[#EE6C4D] border-gray-300 rounded focus:ring-[#EE6C4D]"
                  />
                  <span className="text-sm font-medium text-gray-700">Electricity</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.utilities.internet}
                    onChange={handleUtilityChange('internet')}
                    className="w-4 h-4 text-[#EE6C4D] border-gray-300 rounded focus:ring-[#EE6C4D]"
                  />
                  <span className="text-sm font-medium text-gray-700">Internet</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.utilities.others}
                    onChange={handleUtilityChange('others')}
                    className="w-4 h-4 text-[#EE6C4D] border-gray-300 rounded focus:ring-[#EE6C4D]"
                  />
                  <span className="text-sm font-medium text-gray-700">Others</span>
                </label>
              </div>

              {formData.utilities.others && (
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Others (please specify):
                </label>
                  <input
                    type="text"
                    value={formData.utilities.othersText}
                    onChange={handleOthersTextChange}
                    placeholder="Specify other utilities included"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
              )}
            </div>

            {/* Attach Images Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attach Image/s</h3>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-[#EE6C4D] rounded-lg p-8 text-center mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#EE6C4D] rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-[#EE6C4D] font-medium mb-2">Upload a File</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer px-4 py-2 bg-[#EE6C4D] text-white rounded-lg hover:bg-[#d55a3e] transition-colors ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadingImages ? 'Uploading...' : 'Choose Images'}
                  </label>
                </div>
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Room image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[120px] ${
                  isLoading 
                    ? 'bg-blue-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Room'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
