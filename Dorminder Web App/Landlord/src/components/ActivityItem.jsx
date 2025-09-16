import React from 'react';

const ActivityItem = ({ text, details, color = 'blue' }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'border-l-green-500';
      case 'orange':
        return 'border-l-orange-500';
      case 'blue':
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className={`flex items-start space-x-4 py-6 px-6 border-l-4 ${getColorClasses(color)}`}>
      <div className="flex-1">
        <p className="text-[35px] font-semibold text-gray-900">{text}</p>
        <p className="text-[20px] text-gray-500 mt-1">{details}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
