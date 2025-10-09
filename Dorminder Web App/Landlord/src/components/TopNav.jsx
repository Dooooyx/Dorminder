import React from 'react';
import { useProfile } from '../context/ProfileContext';
import icNotification from '../assets/icons/ic_notification.png';

const TopNav = ({ title = "" }) => {
  const { profileImage, userName } = useProfile();
  return (
    <div className="fixed left-64 top-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center mx-4">
          {/* Notification Bell */}
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <img 
              src={icNotification} 
              alt="Notifications" 
              className="w-8 h-8"
            />
          </button>
          {/* User Profile */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
