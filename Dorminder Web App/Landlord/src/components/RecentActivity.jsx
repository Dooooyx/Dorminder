import React from 'react';
import ActivityItem from './ActivityItem';

const RecentActivity = () => {
  const activities = [
    {
      text: "P5,000 from John Santos (Room 203)",
      details: "Payment received · Sep 8, 2025 - 10:30 AM",
      color: "blue"
    },
    {
      text: "Leaky faucet reported (Room 301)",
      details: "Maintenance report · Sep 8, 2025 - 09:15 AM",
      color: "orange"
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-4xl font-semibold text-gray-900">Recent Activity Feed</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm">
            <ActivityItem
              text={activity.text}
              details={activity.details}
              color={activity.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
