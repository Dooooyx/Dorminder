import React from 'react';
import { useProfile } from '../context/ProfileContext';

const DashboardHeader = () => {
  const { userName, userData, forceRefresh } = useProfile();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-gray-800">Welcome,</h1>
          <span className="text-orange-500 font-bold text-3xl">
            {userData?.firstName ? userData.firstName + '!' : 'User!'}
          </span>
        </div>
        <button
          onClick={forceRefresh}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          title="Refresh user data"
        >
          🔄 Refresh
        </button>
      </div>
      <p className="text-gray-600 text-lg">Here's a quick overview of your dormitory.</p>
    </div>
  );
};

export default DashboardHeader;
