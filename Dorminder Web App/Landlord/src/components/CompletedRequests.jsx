import React from 'react';

const CompletedRequests = () => {
  // Sample data - in real app, this would come from Firebase/Firestore
  const completedRequests = [
    {
      id: 1,
      title: "Aircon Maintenance",
      requester: "Ari Jacob Necesario",
      description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
      date: "September 9, 2025",
      completedDate: "September 10, 2025",
      room: "Room 209",
      status: "completed",
      completedBy: "Maintenance Team"
    },
    {
      id: 2,
      title: "Aircon Maintenance",
      requester: "Ari Jacob Necesario",
      description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
      date: "September 9, 2025",
      completedDate: "September 10, 2025",
      room: "Room 209",
      status: "completed",
      completedBy: "Maintenance Team"
    },
    {
      id: 3,
      title: "Aircon Maintenance",
      requester: "Ari Jacob Necesario",
      description: "Request for aircon maintenance. Dili na siya bugnaw,amet, consectetur adipiscing elit. Nullam magna erat, efficitur ac pulvinar non, dapibus vitae mauris. Integer aliquam erat eu nulla vulputate, in porttitor nulla hendrerit.",
      date: "September 9, 2025",
      completedDate: "September 10, 2025",
      room: "Room 209",
      status: "completed",
      completedBy: "Maintenance Team"
    }
  ];

  return (
    <div className="space-y-3">
      {completedRequests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-lg shadow-sm border-l-4 border-l-green-500 p-4 hover:shadow-md transition-shadow"
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
              
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-400">Requested: {request.date}</span>
                <span className="text-xs text-green-600 font-medium">
                  Completed: {request.completedDate} by {request.completedBy}
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
    </div>
  );
};

export default CompletedRequests;
