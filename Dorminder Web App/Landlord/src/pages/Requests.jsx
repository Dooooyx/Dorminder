import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import OngoingRequests from '../components/OngoingRequests';
import CompletedRequests from '../components/CompletedRequests';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

const Requests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [category, setCategory] = useState('request');
  const [ongoingCount, setOngoingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat === 'report' || cat === 'request') {
      setCategory(cat);
    }
  }, [location.search]);

  // Load request counts
  useEffect(() => {
    if (user) {
      loadRequestCounts();
    }
  }, [user, category]);

  const loadRequestCounts = async () => {
    try {
      const propertyId = user.uid;
      
      // Get ongoing/pending requests count
      const ongoingResult = await requestService.getRequestsByStatus(propertyId, 'pending', category);
      if (ongoingResult.success) {
        setOngoingCount(ongoingResult.data.length);
      }
      
      // Get completed requests count
      const completedResult = await requestService.getRequestsByStatus(propertyId, 'completed', category);
      if (completedResult.success) {
        setCompletedCount(completedResult.data.length);
      }
    } catch (error) {
      console.error('Error loading request counts:', error);
    }
  };

  const tabs = [
    { 
      id: 'ongoing', 
      label: category === 'report' ? 'Pending Report' : 'Pending Requests', 
      count: ongoingCount,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    { 
      id: 'completed', 
      label: category === 'report' ? 'Completed Report' : 'Completed Requests', 
      count: completedCount,
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
        return <OngoingRequests category={category} onRequestUpdate={loadRequestCounts} />;
      case 'completed':
        return <CompletedRequests category={category} onRequestUpdate={loadRequestCounts} />;
      default:
        return <OngoingRequests category={category} onRequestUpdate={loadRequestCounts} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Main Sidebar Navigation */}
      <SideNav />
      
      {/* Top Bar */}
      <TopNav title="Requests" />
      
      {/* Main Content Area */}
      <div className="ml-64 pt-20 min-h-screen flex" style={{ backgroundColor: '#F0F5FA' }}>
        {/* Sub-nav and Content Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Request Sub-Navigation Sidebar */}
          <div className="w-56 bg-white shadow-sm flex flex-col">
            {/* Navigation items */}
            <div className="px-3 py-8 mt-2">
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{category === 'report' ? 'Reports' : 'Requests'}</h1>
              <div />
            </div>
            
            {/* Content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;

