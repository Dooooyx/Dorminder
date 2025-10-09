import React, { useState } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import DashboardHeader from '../components/DashboardHeader';
import StatsGrid from '../components/StatsGrid';
import RecentActivity from '../components/RecentActivity';
import AIAnalyticsDashboard from '../components/AIAnalyticsDashboard';

const Dashboard = () => {
  const [isAIMode, setIsAIMode] = useState(false);

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Top Bar */}
      <TopNav title="" />
      
      {/* Main Content Area */}
      <div className="ml-64 pt-20 min-h-screen" style={{ backgroundColor: '#F0F5FA' }}>
        {/* Main Content - Scrollable */}
        <div className="p-8">
          {/* Dashboard Header */}
          <DashboardHeader isAIMode={isAIMode} onToggleMode={() => setIsAIMode(!isAIMode)} />
          
          {/* Conditional Dashboard Content with Transition */}
          <div className="relative overflow-hidden mt-2">
            {/* Normal Dashboard */}
            <div 
              className={`transition-all duration-700 ease-in-out ${
                isAIMode 
                  ? 'transform -translate-x-full rotate-y-180 opacity-0 absolute inset-0' 
                  : 'transform translate-x-0 rotate-y-0 opacity-100 relative'
              }`}
              style={{
                transform: isAIMode ? 'translateX(-100%) rotateY(180deg)' : 'translateX(0%) rotateY(0deg)',
                opacity: isAIMode ? 0 : 1,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Stats Grid */}
              <StatsGrid />
            </div>

            {/* AI Analytics Dashboard */}
            <div 
              className={`transition-all duration-700 ease-in-out ${
                !isAIMode 
                  ? 'transform translate-x-full rotate-y-180 opacity-0 absolute inset-0' 
                  : 'transform translate-x-0 rotate-y-0 opacity-100 relative'
              }`}
              style={{
                transform: !isAIMode ? 'translateX(100%) rotateY(-180deg)' : 'translateX(0%) rotateY(0deg)',
                opacity: !isAIMode ? 0 : 1,
                transformStyle: 'preserve-3d'
              }}
            >
              <AIAnalyticsDashboard />
            </div>
          </div>
          
          {/* Recent Activity Feed - Separate section, always visible */}
          <div className="mt-8">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
