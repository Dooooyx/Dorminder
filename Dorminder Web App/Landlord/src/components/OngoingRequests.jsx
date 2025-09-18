import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

const OngoingRequests = () => {
  const [ongoingRequests, setOngoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const result = await requestService.getRequestsByStatus(propertyId, 'pending');
      
      if (result.success) {
        setOngoingRequests(result.data);
      } else {
        console.error('Error loading ongoing requests:', result.error);
        // Fallback to mock data for development
        setOngoingRequests([
          {
            id: 1,
            title: "Aircon Maintenance",
            requester: "Ari Jacob Necesario",
            description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
            date: "September 9, 2025",
            room: "Room 209",
            status: "pending",
            priority: "high"
          },
          {
            id: 2,
            title: "Aircon Maintenance",
            requester: "Ari Jacob Necesario",
            description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
            date: "September 9, 2025",
            room: "Room 209",
            status: "pending",
            priority: "medium"
          },
          {
            id: 3,
            title: "Aircon Maintenance",
            requester: "Ari Jacob Necesario",
            description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
            date: "September 9, 2025",
            room: "Room 209",
            status: "pending",
            priority: "low"
          }
        ]);
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

  return (
    <div className="space-y-3 max-w-4xl">
      {ongoingRequests.map((request) => (
        <div
          key={request.id}
          className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(request.priority)} p-4 hover:shadow-md transition-shadow`}
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
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{request.date}</span>
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
    </div>
  );
};

export default OngoingRequests;
