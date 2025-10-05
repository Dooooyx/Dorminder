import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { useAuth } from '../context/AuthContext';
import { dashboardDataService } from '../services/dashboardDataService';
import { roomService } from '../services/roomService';

const StatsGrid = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use user.uid as propertyId (this is how the system currently works)
      const propertyId = user.uid;
      console.log('🔍 Checking for rooms with propertyId:', propertyId);
      
      // Check if user has any rooms (this indicates they have a property)
      const roomsResult = await roomService.getRoomsByProperty(propertyId);
      console.log('🏠 Rooms result:', roomsResult);
      
      if (!roomsResult.success || !roomsResult.data || roomsResult.data.length === 0) {
        throw new Error('No rooms found. Please add rooms first.');
      }

      console.log('📊 Loading dashboard data for propertyId:', propertyId);
      const data = await dashboardDataService.getDashboardData(propertyId);
      console.log('✅ Dashboard data loaded:', data);
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-2 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-500 text-2xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Unable to load dashboard data</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              {error.includes('No rooms found') && (
                <div className="mt-3">
                  <p className="text-red-700 text-sm font-medium">To get started:</p>
                  <ol className="text-red-600 text-sm mt-1 list-decimal list-inside space-y-1">
                    <li>Go to the "Rooms" section in the sidebar</li>
                    <li>Add your first room</li>
                    <li>Add tenants to see dashboard statistics</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-yellow-500 text-2xl mr-3">ℹ️</div>
            <div>
              <h3 className="text-yellow-800 font-medium">No data available</h3>
              <p className="text-yellow-600 text-sm mt-1">Add tenants, rooms, and billing data to see statistics.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Rent Collected",
      value: dashboardData.rentCollected.formatted.collected,
      subtitle: "This Month",
      progress: dashboardData.rentCollected.rate,
      progressText: `${dashboardData.rentCollected.formatted.rate} of ${dashboardData.rentCollected.formatted.expected} expected`,
      color: "green",
      isDark: true,
      showHideMoney: true
    },
    {
      title: "Total Rooms",
      value: dashboardData.totalRooms.formatted.total,
      subtitle: dashboardData.totalRooms.formatted.vacant,
      progress: dashboardData.totalRooms.occupancyRate,
      progressText: dashboardData.totalRooms.formatted.occupied + " Occupied",
      color: "light-blue",
      isDark: false
    },
    {
      title: "Active Tenants",
      value: dashboardData.activeTenants.formatted.active,
      subtitle: "Currently Occupied",
      progress: dashboardData.activeTenants.occupancyRate,
      progressText: dashboardData.activeTenants.formatted.total,
      color: "blue",
      isDark: false
    },
    {
      title: "Pending Request",
      value: dashboardData.pendingRequests.formatted.pending,
      subtitle: "Open Requests",
      progress: dashboardData.pendingRequests.pendingRate,
      progressText: dashboardData.pendingRequests.formatted.total,
      color: "red",
      isDark: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          progress={stat.progress}
          progressText={stat.progressText}
          color={stat.color}
          isDark={stat.isDark}
          showHideMoney={stat.showHideMoney}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
