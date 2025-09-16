import React, { useState } from 'react';
import InputField from './InputField';

const AddRoomModal = ({ isOpen, onClose, onAddRoom }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    monthlyRent: '',
    capacity: '',
    description: '',
    amenities: '',
    floor: '',
    building: ''
  });
  const [errors, setErrors] = useState({});

  const roomTypes = [
    'Single Room',
    'Double Room', 
    'Triple Room',
    'Quad Room',
    'Studio',
    'Apartment'
  ];

  const floors = [
    'Ground Floor',
    '1st Floor',
    '2nd Floor', 
    '3rd Floor',
    '4th Floor',
    '5th Floor'
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const roomData = {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        capacity: Number(formData.capacity),
        status: 'Vacant',
        tenant: '',
        leaseDates: ''
      };
      
      onAddRoom(roomData);
      handleClose();
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
      building: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  value={formData.roomType}
                  onChange={handleInputChange('roomType')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.roomType ? 'border-red-500' : 'border-gray-300'
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

            {/* Floor and Building Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor *
                </label>
                <select
                  value={formData.floor}
                  onChange={handleInputChange('floor')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.floor ? 'border-red-500' : 'border-gray-300'
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

              <div>
                <InputField
                  id="building"
                  label="Building/Block"
                  placeholder="e.g., Building A, Block 1"
                  value={formData.building}
                  onChange={handleInputChange('building')}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Describe the room features, size, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <textarea
                value={formData.amenities}
                onChange={handleInputChange('amenities')}
                placeholder="e.g., Air conditioning, WiFi, Private bathroom, Kitchenette"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
