import React, { useState } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import OngoingRequests from '../components/OngoingRequests';
import CompletedRequests from '../components/CompletedRequests';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('ongoing');

  const tabs = [
    { 
      id: 'ongoing', 
      label: 'Pending Requests', 
      count: 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    { 
      id: 'completed', 
      label: 'Completed Requests', 
      count: 11,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'ongoing':
        return <OngoingRequests />;
      case 'completed':
        return <CompletedRequests />;
      default:
        return <OngoingRequests />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Main Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Top Bar - spans across sub-nav and request cards */}
        <TopNav title="Requests" />
        
        {/* Sub-nav and Content Container */}
        <div className="flex-1 flex">
          {/* Request Sub-Navigation Sidebar */}
          <div className="w-56 bg-white shadow-sm flex flex-col">
            {/* Navigation items */}
            <div className="px-3 py-4">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>
                        {tab.icon}
                      </div>
                      <span className="text-sm font-medium">{tab.label}</span>
                    </div>
                    {tab.count > 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? 'bg-white text-orange-500'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Request Cards Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Requests</h1>
            
            {/* Content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
