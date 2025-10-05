import React from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import DashboardHeader from '../components/DashboardHeader';
import StatsGrid from '../components/StatsGrid';
import RecentActivity from '../components/RecentActivity';
import AIAnalyticsDashboard from '../components/AIAnalyticsDashboard';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F0F5FA' }}>
        {/* Top Bar */}
        <TopNav title="" />
        
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Dashboard Header */}
          <DashboardHeader />
          
          {/* Stats Grid */}
          <StatsGrid />
          
          {/* AI Analytics Dashboard */}
          <div className="mb-8">
            <AIAnalyticsDashboard />
          </div>
          
          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
