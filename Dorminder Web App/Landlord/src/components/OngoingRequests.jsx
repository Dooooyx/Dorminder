import React, { useState, useEffect, useRef } from 'react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

import ic_prev from '../assets/icons/ic_prev.png';
import ic_next from '../assets/icons/ic_next.png';

const OngoingRequests = ({ category }) => {
  const [ongoingRequests, setOngoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const scrollViewRef = useRef(null);
  const { user } = useAuth();

  // Load ongoing requests on component mount
  useEffect(() => {
    if (user) {
      loadOngoingRequests();
    }
  }, [user, category]);

  const loadOngoingRequests = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      const propertyId = user.uid; // Use user's UID as propertyId
      console.log('🔍 Landlord querying requests with:', {
        propertyId,
        status: 'pending',
        category
      });
      
      const result = await requestService.getRequestsByStatus(propertyId, 'pending', category);
      
      if (result.success) {
        console.log('✅ Requests loaded:', result.data.length, 'requests found');
        setOngoingRequests(result.data);
      } else {
        console.error('Error loading ongoing requests:', result.error);
        setOngoingRequests([]);
      }
    } catch (error) {
      console.error('Error loading ongoing requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const result = await requestService.completeRequest(requestId, 'Request completed successfully');
      
      if (result.success) {
        // Refresh the list
        await loadOngoingRequests();
        console.log('Request completed successfully');
      } else {
        console.error('Error completing request:', result.error);
        alert('Error completing request: ' + result.error);
      }
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Error completing request: ' + error.message);
    }
  };

  // Get all images from a request (both old imageUrl and new images array)
  const getAllImages = (request) => {
    const images = [];
    if (request.imageUrl) images.push(request.imageUrl);
    if (request.images && request.images.length > 0) {
      images.push(...request.images);
    }
    return images;
  };

  const handleImagePress = (request, index = 0) => {
    const images = getAllImages(request);
    if (images.length > 0) {
      setCurrentImages(images);
      setCurrentImageIndex(index);
      setImageModalVisible(true);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
  };

  // Scroll to current image when modal opens or index changes
  useEffect(() => {
    if (imageModalVisible && scrollViewRef.current && currentImages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: currentImageIndex * window.innerWidth,
          animated: false
        });
      }, 100);
    }
  }, [imageModalVisible, currentImageIndex, currentImages.length]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-orange-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading ongoing requests...</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (request) => {
    // Prefer explicit date/time fields if present
    const explicitDate = request.date;
    const explicitTime = request.time;
    if (explicitDate && explicitTime) {
      return { date: explicitDate, time: explicitTime };
    }

    // Try Firestore timestamp
    const ts = request.createdAt;
    if (ts && (ts.seconds || ts.toDate)) {
      const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
      const dateStr = d.toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      const timeStr = d.toLocaleTimeString(undefined, {
        hour: 'numeric', minute: '2-digit'
      });
      return { date: dateStr, time: timeStr };
    }

    // Fallbacks
    return { date: request.date || '', time: request.time || '' };
  };

  return (
    <div className="space-y-3 max-w-4xl">
      {ongoingRequests.map((request) => (
        <div
          key={request.id}
          className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(request.priority)} p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">{request.title}</h3>
                <span className="text-3xl font-bold text-gray-900 ml-4 whitespace-nowrap">{request.room}</span>
              </div>
              
              <p className="text-[18px] text-gray-600 font-medium mb-3">{request.requester}</p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-2">
                {request.description}
              </p>

              {/* Image holder - Enhanced for better display */}
              <div className="mb-3">
                {(() => {
                  const images = getAllImages(request);
                  console.log('🖼️ Request images for', request.title, ':', images);
                  
                  if (images.length > 0) {
                    return (
                      <div className="relative inline-block">
                        <img
                          src={images[0]}
                          alt="Request image"
                          className="w-64 h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                          onClick={() => handleImagePress(request, 0)}
                          onError={(e) => {
                            console.error('Image failed to load:', images[0]);
                            e.target.style.display = 'none';
                          }}
                        />
                        {/* Image Counter Badge */}
                        {images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            +{images.length - 1}
                          </div>
                        )}
                        {/* Image Gallery Icon */}
                        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-full p-1 shadow-md">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  {(() => { const { date, time } = formatDateTime(request); return (
                    <>
                      <span>{date}</span>
                      {date && time && <span className="text-gray-300">|</span>}
                      <span>{time}</span>
                    </>
                  ); })()}
                </span>
                <button
                  onClick={() => handleCompleteRequest(request.id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {ongoingRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending requests at the moment.</p>
        </div>
      )}
      {/* Image Modal with Slider */}
      {imageModalVisible && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-opacity-30 flex items-center justify-center">
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
                onClick={() => setImageModalVisible(false)}
              >
                ✕ Close
              </button>
            </div>
            
            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center overflow-hidden relative">
              <div 
                ref={scrollViewRef}
                className="flex h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {currentImages.map((imageUrl, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={`Request image ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons - Very close to image (10px margin) */}
            {currentImages.length > 1 && (
              <>
                  <button
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-80 hover:bg-opacity-95 hover:scale-110 hover:shadow-xl p-4 rounded-full transition-all duration-200 z-20 shadow-lg"
                    onClick={handlePrevImage}
                  >
                    <img src={ic_prev} alt="Previous" className="w-8 h-8" />
                  </button>
                  <button
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-80 hover:bg-opacity-95 hover:scale-110 hover:shadow-xl p-4 rounded-full transition-all duration-200 z-20 shadow-lg"
                    onClick={handleNextImage}
                  >
                  <img src={ic_next} alt="Next" className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingRequests;
