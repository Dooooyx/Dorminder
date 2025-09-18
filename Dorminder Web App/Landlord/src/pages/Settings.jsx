import React, { useState } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import SettingsSubNav from '../components/SettingsSubNav';
import PersonalInfo from '../components/PersonalInfo';
import SecurityPrivacy from '../components/SecurityPrivacy';
import Notifications from '../components/Notifications';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <PersonalInfo />;
      case 'security':
        return <SecurityPrivacy />;
      case 'notifications':
        return <Notifications />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Main Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Top Bar - spans across sub-nav and content */}
        <TopNav title="Settings" />
        
        {/* Sub-nav and Content Container */}
        <div className="flex-1 flex">
          {/* Settings Sub-Navigation Sidebar */}
          <SettingsSubNav activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Settings Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            
            {/* Content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

