import React from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        {/* Top Bar */}
        <TopNav title="Dashboard" />
        
        {/* Main Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600">Welcome to your Dorminder dashboard!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
