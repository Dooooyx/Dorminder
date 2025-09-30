import React, { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';

const RoomDetailsModal = ({ isOpen, onClose, room, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get all images from room data
  const getAllImages = () => {
    const images = [];
    if (room?.images && Array.isArray(room.images)) {
      images.push(...room.images);
    }
    return images;
  };

  const currentImages = getAllImages();

  // Initialize edit data when room changes
  useEffect(() => {
    if (room) {
      setEditData({
        roomNumber: room.roomNumber || '',
        roomType: room.roomType || '',
        monthlyRent: room.monthlyRent || '',
        capacity: room.capacity || '',
        floor: room.floor || '',
        bathroom: room.bathroom || '',
        airconditioning: room.airconditioning || '',
        description: room.description || '',
        amenities: room.amenities || '',
        utilities: room.utilities || {
          water: false,
          electricity: false,
          internet: false,
          others: false,
          othersText: ''
        }
      });
    }
  }, [room]);

  const handleImagePress = (index) => {
    setCurrentImageIndex(index);
    setImageModalVisible(true);
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < currentImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleClose = () => {
    setImageModalVisible(false);
    setCurrentImageIndex(0);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edit data to original room data
    if (room) {
      setEditData({
        roomNumber: room.roomNumber || '',
        roomType: room.roomType || '',
        monthlyRent: room.monthlyRent || '',
        capacity: room.capacity || '',
        floor: room.floor || '',
        bathroom: room.bathroom || '',
        airconditioning: room.airconditioning || '',
        description: room.description || '',
        amenities: room.amenities || '',
        utilities: room.utilities || {
          water: false,
          electricity: false,
          internet: false,
          others: false,
          othersText: ''
        }
      });
    }
  };

  const handleInputChange = (field) => (e) => {
    setEditData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleUtilityChange = (utility) => (e) => {
    setEditData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utility]: e.target.checked
      }
    }));
  };

  const handleOthersTextChange = (e) => {
    setEditData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        othersText: e.target.value
      }
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const result = await roomService.updateRoom(room.id, editData);
      if (result.success) {
        // Call the onEdit callback to refresh the room data in the parent component
        if (onEdit) {
          onEdit({ ...room, ...editData });
        }
        setIsEditing(false);
        alert('Room updated successfully!');
      } else {
        alert(`Failed to update room: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Error updating room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatUtilities = () => {
    if (!room?.utilities) return 'None';
    
    const utilities = [];
    if (room.utilities.water) utilities.push('Water');
    if (room.utilities.electricity) utilities.push('Electricity');
    if (room.utilities.internet) utilities.push('Internet');
    if (room.utilities.others && room.utilities.othersText) {
      utilities.push(room.utilities.othersText);
    }
    
    return utilities.length > 0 ? utilities.join(', ') : 'None';
  };

  if (!isOpen || !room) return null;

  // Debug: Log the room data
  console.log('RoomDetailsModal received room data:', room);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-md bg-opacity-30"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
             {/* Header */}
             <div className="sticky top-0  border-gray-200 px-6 py-2 rounded-t-lg">
               <div className="flex justify-end items-center">
                 <button
                   onClick={onClose}
                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                 >
                   ×
                 </button>
               </div>
             </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Image Gallery - Horizontal scroll */}
          {currentImages.length > 0 && (
            <div className="mb-6">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                {currentImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={image.url || image}
                      alt={`Room ${room.roomNumber} - Image ${index + 1}`}
                      className="w-64 h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setImageModalVisible(true);
                      }}
                    />
                    {currentImages.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}/{currentImages.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Details - Single Column */}
          <div className="space-y-3">
            {/* Room Number Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Room #{room.roomNumber}</h2>
            {isEditing ? (
              // Edit Mode
              <>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 mr-2 w-32">Floor:</span>
                  <select
                    value={editData.floor}
                    onChange={handleInputChange('floor')}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Floor</option>
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                    <option value="4th Floor">4th Floor</option>
                    <option value="5th Floor">5th Floor</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 mr-2 w-32">Room Type:</span>
                  <select
                    value={editData.roomType}
                    onChange={handleInputChange('roomType')}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Room Type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Quad">Quad</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 mr-2 w-32">Monthly Rent:</span>
                  <input
                    type="number"
                    value={editData.monthlyRent}
                    onChange={handleInputChange('monthlyRent')}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter monthly rent"
                  />
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 mr-2 w-32">Capacity:</span>
                  <input
                    type="number"
                    value={editData.capacity}
                    onChange={handleInputChange('capacity')}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter capacity"
                  />
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 mr-2 w-32">Bathroom:</span>
                  <select
                    value={editData.bathroom}
                    onChange={handleInputChange('bathroom')}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Bathroom</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 mr-2 w-32">Airconditioning:</span>
                  <select
                    value={editData.airconditioning}
                    onChange={handleInputChange('airconditioning')}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Airconditioning</option>
                    <option value="With Aircon">With Aircon</option>
                    <option value="Without Aircon">Without Aircon</option>
                  </select>
                </div>
                <div className="flex items-start">
                  <span className="font-bold text-gray-800 mr-2 w-32 mt-1">Utilities:</span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editData.utilities?.water || false}
                          onChange={handleUtilityChange('water')}
                          className="mr-2"
                        />
                        <span className="text-sm">Water</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editData.utilities?.electricity || false}
                          onChange={handleUtilityChange('electricity')}
                          className="mr-2"
                        />
                        <span className="text-sm">Electricity</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editData.utilities?.internet || false}
                          onChange={handleUtilityChange('internet')}
                          className="mr-2"
                        />
                        <span className="text-sm">Internet</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editData.utilities?.others || false}
                          onChange={handleUtilityChange('others')}
                          className="mr-2"
                        />
                        <span className="text-sm">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={editData.utilities?.othersText || ''}
                        onChange={handleOthersTextChange}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Specify other utilities"
                        disabled={!editData.utilities?.others}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Display Mode
              <>
                <div className="flex">
                  <span className="font-bold text-gray-800 mr-2">Floor:</span>
                  <span className="text-gray-700" style={{ fontSize: '20px' }}>{room.floor || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray-800 mr-2">Room Type:</span>
                  <span className="text-gray-700" style={{ fontSize: '20px' }}>{room.roomType || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray-800 mr-2">Monthly Rent:</span>
                  <span className="text-gray-700" style={{ fontSize: '20px' }}>₱{room.monthlyRent?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray-800 mr-2">Capacity:</span>
                  <span className="text-gray-700" style={{ fontSize: '20px' }}>{room.capacity || 'N/A'} person(s)</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray-800 mr-2">Bathroom:</span>
                  <span className="text-gray-700" style={{ fontSize: '20px' }}>{room.bathroom || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray-800 mr-2">Airconditioning:</span>
                  <span className="text-gray-700" style={{ fontSize: '20px' }}>{room.airconditioning || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray-800 mr-2">Utilities Included:</span>
                  <span className="text-gray-700" style={{ fontSize: '20px' }}>{formatUtilities()}</span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          {room.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{room.description}</p>
            </div>
          )}

          {/* Amenities */}
          {room.amenities && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Amenities</h3>
              <p className="text-gray-600">{room.amenities}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white  border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Info
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal with Slider */}
      {imageModalVisible && currentImages.length > 0 && (
        <div className="fixed inset-0 z-60 backdrop-blur-md bg-opacity-30 flex items-center justify-center">
          <div className="w-full h-full flex flex-col relative">
            {/* Top Bar with Image Indicator and Close Button */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
              {/* Image Indicator - Top Left */}
              {currentImages.length > 1 && (
                <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {currentImageIndex + 1} / {currentImages.length}
                </span>
              )}
              
              {/* Close Button */}
              <button
                className="bg-black bg-opacity-50 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-opacity-70 hover:scale-105 hover:shadow-lg transition-all duration-200"
                onClick={handleClose}
              >
                ✕ Close
              </button>
            </div>
            
            {/* Main Image Container - Show only current image */}
            <div className="flex-1 flex items-center justify-center overflow-hidden relative">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={currentImages[currentImageIndex]?.url || currentImages[currentImageIndex]}
                  alt={`Room ${room.roomNumber} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            
            {/* Navigation Buttons - Very close to image (10px margin) */}
            {currentImages.length > 1 && (
              <>
                <button
                  className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 p-4 rounded-full transition-all duration-200 z-20 shadow-lg ${
                    currentImageIndex === 0 
                      ? 'bg-gray-200 bg-opacity-50 cursor-not-allowed' 
                      : 'bg-gray-300 bg-opacity-80 hover:bg-opacity-95 hover:scale-110 hover:shadow-xl'
                  }`}
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 p-4 rounded-full transition-all duration-200 z-20 shadow-lg ${
                    currentImageIndex === currentImages.length - 1 
                      ? 'bg-gray-200 bg-opacity-50 cursor-not-allowed' 
                      : 'bg-gray-300 bg-opacity-80 hover:bg-opacity-95 hover:scale-110 hover:shadow-xl'
                  }`}
                  onClick={handleNextImage}
                  disabled={currentImageIndex === currentImages.length - 1}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailsModal;
