import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardDataService } from '../services/dashboardDataService';
import { aiAnalyticsService } from '../services/aiAnalyticsService';
import { roomService } from '../services/roomService';

const AIAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use user.uid as propertyId (this is how the system currently works)
      const propertyId = user.uid;
      console.log('🔍 AI Analytics - Checking for rooms with propertyId:', propertyId);
      
      // Check if user has any rooms (this indicates they have a property)
      const roomsResult = await roomService.getRoomsByProperty(propertyId);
      console.log('🏠 AI Analytics - Rooms result:', roomsResult);
      
      if (!roomsResult.success || !roomsResult.data || roomsResult.data.length === 0) {
        throw new Error('No rooms found. Please add rooms first.');
      }

      // Fetch dashboard data
      console.log('📊 AI Analytics - Loading dashboard data for propertyId:', propertyId);
      const data = await dashboardDataService.getDashboardData(propertyId);
      console.log('✅ AI Analytics - Dashboard data loaded:', data);
      setDashboardData(data);

      // Generate enhanced AI forecast (with GROQ if available)
      console.log('🤖 AI Analytics - Generating enhanced forecast...');
      const forecastData = await aiAnalyticsService.generateEnhancedForecast(data);
      console.log('✅ AI Analytics - Forecast generated:', forecastData);
      setForecast(forecastData);

    } catch (err) {
      console.error('Error loading analytics data:', err);
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
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading AI Analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes('No rooms found') && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium mb-2">To enable AI Analytics:</p>
              <ol className="text-blue-700 text-sm list-decimal list-inside space-y-1">
                <li>Go to the "Rooms" section in the sidebar</li>
                <li>Add your first room</li>
                <li>Add tenants and billing data</li>
                <li>Return here to see AI-powered insights</li>
              </ol>
            </div>
          )}
          <button
            onClick={loadAnalyticsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">🤖 AI Analytics</h2>
              {forecast?.aiEnhanced && (
                <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                  ✨ AI Enhanced
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              Financial forecasting and insights powered by AI
              {forecast?.aiEnhanced ? ' + GROQ' : ' (Local Algorithms)'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={loadAnalyticsData}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh data"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
                    <button
                      onClick={async () => {
                        const result = await aiAnalyticsService.testGROQConnection();
                        if (result.success) {
                          alert(`✅ GROQ API is working!\n\nModel: ${result.model}\nResponse: ${JSON.stringify(result.response, null, 2)}`);
                        } else {
                          alert(`❌ GROQ API Error: ${result.error}\n\nThis is normal - the system will use enhanced local AI instead.`);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Test GROQ API"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'forecast', label: 'Forecast', icon: '🔮' },
            { id: 'ai-analysis', label: 'AI Analysis', icon: '🤖' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(
                        dashboardData?.financialMetrics?.averageMonthlyRevenue || 
                        dashboardData?.financialMetrics?.totalMonthlyRent || 
                        0
                      )}
                    </p>
                    <p className="text-blue-700 text-sm">
                      Growth: {dashboardData?.financialMetrics?.revenueGrowth?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-green-900">
                      {dashboardData?.occupancyMetrics?.occupancyRate?.toFixed(1) || 0}%
                    </p>
                    <p className="text-green-700 text-sm">
                      Retention: {dashboardData?.occupancyMetrics?.retentionRate?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <div className="text-4xl">🏠</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Growth Rate</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {dashboardData?.financialMetrics?.revenueGrowth?.toFixed(1) || 0}%
                    </p>
                    <p className="text-purple-700 text-sm">
                      Revenue Growth
                    </p>
                  </div>
                  <div className="text-4xl">📈</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalRooms?.total || 0}</p>
                <p className="text-sm text-gray-600">Total Rooms</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.activeTenants?.active || 0}</p>
                <p className="text-sm text-gray-600">Active Tenants</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.pendingRequests?.pending || 0}</p>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.maintenanceMetrics?.completionRate?.toFixed(0) || 0}%
                </p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecast' && forecast && (
          <div className="space-y-6">
            {/* Yearly Forecast */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">📅 Annual Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-900">
                    {formatCurrency(forecast.yearly.revenue)}
                  </p>
                  <p className="text-indigo-700 text-sm">Projected Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-900">
                    {formatCurrency(forecast.yearly.netIncome)}
                  </p>
                  <p className="text-indigo-700 text-sm">Net Income</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-900">
                    {forecast.yearly.profitMargin.toFixed(1)}%
                  </p>
                  <p className="text-indigo-700 text-sm">Profit Margin</p>
                </div>
              </div>
            </div>

            {/* Monthly Forecast */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Monthly Forecast (Next 6 Months)</h3>
              <div className="space-y-3">
                {forecast.monthly.slice(0, 6).map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {new Date().getMonth() + index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{month.month}</p>
                        <p className="text-sm text-gray-600">{month.occupancy}% occupancy</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(month.revenue)}</p>
                      <p className="text-sm text-green-600">+{formatCurrency(month.netIncome)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {activeTab === 'ai-analysis' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">🤖 AI Analysis</h3>
            
            {forecast?.aiEnhanced && forecast?.aiInsights ? (
              <div className="space-y-6">
                {/* AI Analysis Card */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">🤖</span>
                    <h4 className="text-lg font-semibold text-purple-900">GROQ AI Analysis</h4>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      Confidence: {(forecast.aiInsights.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 border border-purple-100 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                        {forecast.aiInsights.aiAnalysis}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Points */}
                {forecast.aiInsights.keyPoints && forecast.aiInsights.keyPoints.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">🔑 Key Points</h4>
                    <ul className="space-y-3">
                      {forecast.aiInsights.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <p className="text-gray-700">{point}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Recommendations */}
                {forecast.aiInsights.recommendations && forecast.aiInsights.recommendations.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 AI Recommendations</h4>
                    <div className="space-y-4">
                      {forecast.aiInsights.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">🤖</span>
                            <div>
                              <p className="font-medium text-gray-900">{rec.action}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  {rec.priority} priority
                                </span>
                                <span className="text-xs text-gray-500 capitalize">{rec.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* API Status */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <h4 className="font-semibold text-green-900">GROQ API Connected</h4>
                      <p className="text-green-700 text-sm mt-1">
                        AI analysis powered by GROQ's Llama 3.3 70B model
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis Not Available</h3>
                <p className="text-gray-600 mb-4">
                  {aiAnalyticsService.isGROQAvailable() 
                    ? 'AI analysis is being processed...' 
                    : 'Configure GROQ API to enable AI analysis'
                  }
                </p>
                {!aiAnalyticsService.isGROQAvailable() && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-yellow-800 text-sm">
                      Add your GROQ API key to the .env.local file to enable AI-powered analysis
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
