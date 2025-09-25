import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

const CompletedRequests = ({ category }) => {
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { user } = useAuth();

  // Load completed requests on component mount
  useEffect(() => {
    if (user) {
      loadCompletedRequests();
    }
  }, [user]);

  const loadCompletedRequests = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      const propertyId = user.uid; // Use user's UID as propertyId
      const result = await requestService.getRequestsByStatus(propertyId, 'completed', category);
      
      if (result.success) {
        setCompletedRequests(result.data);
      } else {
        console.error('Error loading completed requests:', result.error);
        setCompletedRequests([]);
      }
    } catch (error) {
      console.error('Error loading completed requests:', error);
      setCompletedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // No fallback data in production

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading completed requests...</div>
      </div>
    );
  }

  const requestsToShow = completedRequests;

  const formatDateTime = (request) => {
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
    return { date: request.date || '', time: request.time || '' };
  };

  return (
    <div className="space-y-3">
      {requestsToShow.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-lg shadow-sm border-l-4 border-l-green-500 p-4 hover:shadow-md transition-shadow"
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
                {/* Single imageUrl */}
                {request.imageUrl && (
                  <img
                    src={request.imageUrl}
                    alt="Request image"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewUrl(request.imageUrl)}
                  />
                )}

                {/* Multiple images */}
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

                {/* Placeholder */}
                {!request.imageUrl && (!request.images || request.images.length === 0) && (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500">
                  {(() => { const { date, time } = formatDateTime(request); return (
                    <>Requested: {date}{date && time && ' | '}{time}</>
                  ); })()}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Completed: {request.completedDate} {request.completedBy ? `by ${request.completedBy}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {completedRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No completed requests at the moment.</p>
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

export default CompletedRequests;
