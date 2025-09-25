import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

const OngoingRequests = ({ category }) => {
  const [ongoingRequests, setOngoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { user } = useAuth();

  // Load ongoing requests on component mount
  useEffect(() => {
    if (user) {
      loadOngoingRequests();
    }
  }, [user]);

  const loadOngoingRequests = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      const propertyId = user.uid; // Use user's UID as propertyId
      const result = await requestService.getRequestsByStatus(propertyId, 'pending', category);
      
      if (result.success) {
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

              {/* Image holder */}
              <div className="mb-3">
                {/* Single imageUrl from tenant app */}
                {request.imageUrl && (
                  <img
                    src={request.imageUrl}
                    alt="Request image"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewUrl(request.imageUrl)}
                  />
                )}

                {/* Multiple images array (future-proof) */}
                {!request.imageUrl && request.images && request.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {request.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Request image ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setPreviewUrl(imageUrl)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Placeholder when no image */}
                {!request.imageUrl && (!request.images || request.images.length === 0) && (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
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
      {/* Image preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <img src={previewUrl} alt="Preview" className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default OngoingRequests;
