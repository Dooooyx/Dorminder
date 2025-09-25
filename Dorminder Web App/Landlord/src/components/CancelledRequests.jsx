import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

const CancelledRequests = () => {
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load cancelled requests on component mount
  useEffect(() => {
    if (user) {
      loadCancelledRequests();
    }
  }, [user]);

  const loadCancelledRequests = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      const propertyId = user.uid; // Use user's UID as propertyId
      const result = await requestService.getRequestsByStatus(propertyId, 'cancelled');
      
      if (result.success) {
        setCancelledRequests(result.data);
      } else {
        console.error('Error loading cancelled requests:', result.error);
        // Fallback to empty array
        setCancelledRequests([]);
      }
    } catch (error) {
      console.error('Error loading cancelled requests:', error);
      setCancelledRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for development
  const fallbackData = [
    {
      id: 1,
      title: "Aircon Maintenance",
      requester: "Ari Jacob Necesario",
      description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
      date: "September 9, 2025",
      cancelledDate: "September 9, 2025",
      room: "Room 209",
      status: "cancelled",
      cancelledBy: "Tenant withdrew request"
    },
    {
      id: 2,
      title: "Aircon Maintenance",
      requester: "Ari Jacob Necesario",
      description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
      date: "September 9, 2025",
      cancelledDate: "September 9, 2025",
      room: "Room 209",
      status: "cancelled",
      cancelledBy: "Tenant withdrew request"
    },
    {
      id: 3,
      title: "Aircon Maintenance",
      requester: "Ari Jacob Necesario",
      description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
      date: "September 9, 2025",
      cancelledDate: "September 9, 2025",
      room: "Room 209",
      status: "cancelled",
      cancelledBy: "Tenant withdrew request"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading cancelled requests...</div>
      </div>
    );
  }

  const requestsToShow = cancelledRequests.length > 0 ? cancelledRequests : fallbackData;

  return (
    <div className="space-y-3 max-w-4xl">
      {requestsToShow.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-lg shadow-sm border-l-4 border-l-red-500 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
                <span className="text-sm font-medium text-gray-600">{request.room}</span>
              </div>
              
              <p className="text-sm text-gray-500 mb-2">{request.requester}</p>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                {request.description}
              </p>
              
              {/* Display request images if available */}
              {request.images && request.images.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {request.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Request image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-400">Requested: {request.date}</span>
                <span className="text-xs text-red-600 font-medium">
                  Cancelled: {request.cancelledDate} - {request.cancelledBy}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {cancelledRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cancelled requests at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default CancelledRequests;
