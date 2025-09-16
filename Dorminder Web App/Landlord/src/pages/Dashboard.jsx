import React, { useEffect } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import DashboardHeader from '../components/DashboardHeader';
import StatsGrid from '../components/StatsGrid';
import RecentActivity from '../components/RecentActivity';
import { useProfile } from '../context/ProfileContext';

const Dashboard = () => {
  const { forceRefresh } = useProfile();

  // Refresh user data when Dashboard loads
  useEffect(() => {
    forceRefresh();
  }, []); // Remove forceRefresh from dependencies to prevent infinite loop
  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        {/* Top Bar */}
        <TopNav title="Overview" />
        
        {/* Main Content */}
        <div className="p-8">
          {/* Dashboard Header */}
          <DashboardHeader />
          
          {/* Stats Grid */}
          <StatsGrid />
          
          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
