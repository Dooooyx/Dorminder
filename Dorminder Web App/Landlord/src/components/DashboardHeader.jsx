import React from 'react';
import { useProfile } from '../context/ProfileContext';

const DashboardHeader = ({ isAIMode, onToggleMode }) => {
  const { userName, userData } = useProfile();

  return (
    <div className="mb-4 mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-gray-800">Welcome,</h1>
          <span className="text-orange-500 font-bold text-3xl">
            {userData?.firstName ? userData.firstName + '!' : 'User!'}
          </span>
        </div>
        {/* AI/Normal Dashboard Toggle */}
        <button
          onClick={onToggleMode}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
            !isAIMode 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title={!isAIMode ? 'Switch to AI Dashboard' : 'Switch to Normal Dashboard'}
        >
          <div className="flex items-center space-x-2">
            {!isAIMode ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI Dashboard</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Normal Dashboard</span>
              </>
            )}
          </div>
        </button>
      </div>
      <p className="text-gray-600 text-lg">
        {isAIMode ? 'AI-powered insights and analytics for your dormitory.' : 'Here\'s a quick overview of your dormitory.'}
      </p>
    </div>
  );
};

export default DashboardHeader;





