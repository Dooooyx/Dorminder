import React, { useState, useEffect } from 'react';
import { superAdminService } from '../services/superAdminService';

const SuperAdminLandlordList = () => {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLandlords();
  }, []);

  const loadLandlords = async () => {
    setLoading(true);
    setError('');
    const result = await superAdminService.getAllLandlords();
    
    if (result.success) {
      // Sort by email for easier viewing
      const sorted = result.landlords.sort((a, b) => 
        (a.email || '').localeCompare(b.email || '')
      );
      setLandlords(sorted);
    } else {
      setError(result.error || 'Failed to load landlords');
    }
    setLoading(false);
  };

  const handleToggleStatus = async (landlordId, currentEnabled) => {
    setUpdating({ ...updating, [landlordId]: true });
    
    const result = await superAdminService.toggleLandlordStatus(
      landlordId, 
      currentEnabled
    );
    
    if (result.success) {
      // Update local state
      setLandlords(landlords.map(landlord => 
        landlord.id === landlordId 
          ? { ...landlord, enabled: !currentEnabled }
          : landlord
      ));
    } else {
      setError(result.error || 'Failed to update landlord status');
      setTimeout(() => setError(''), 5000);
    }
    
    setUpdating({ ...updating, [landlordId]: false });
  };

  // Get subscription plan for a landlord
  const getSubscriptionPlan = (landlord) => {
    return landlord.subscriptionPlan || 'Free';
  };

  // Format expiration date
  const formatExpirationDate = (landlord) => {
    if (!landlord.subscriptionExpirationDate) {
      return 'N/A';
    }
    
    let expirationDate;
    if (landlord.subscriptionExpirationDate.toDate) {
      // Firestore Timestamp
      expirationDate = landlord.subscriptionExpirationDate.toDate();
    } else if (landlord.subscriptionExpirationDate instanceof Date) {
      expirationDate = landlord.subscriptionExpirationDate;
    } else if (typeof landlord.subscriptionExpirationDate === 'string') {
      expirationDate = new Date(landlord.subscriptionExpirationDate);
    } else {
      return 'N/A';
    }
    
    // Check if date is valid
    if (isNaN(expirationDate.getTime())) {
      return 'N/A';
    }
    
    // Format as MM/DD/YYYY
    return expirationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Check if subscription is expired
  const isSubscriptionExpired = (landlord) => {
    if (!landlord.subscriptionExpirationDate) {
      return false;
    }
    
    let expirationDate;
    if (landlord.subscriptionExpirationDate.toDate) {
      expirationDate = landlord.subscriptionExpirationDate.toDate();
    } else if (landlord.subscriptionExpirationDate instanceof Date) {
      expirationDate = landlord.subscriptionExpirationDate;
    } else if (typeof landlord.subscriptionExpirationDate === 'string') {
      expirationDate = new Date(landlord.subscriptionExpirationDate);
    } else {
      return false;
    }
    
    if (isNaN(expirationDate.getTime())) {
      return false;
    }
    
    return expirationDate < new Date();
  };

  // Get subscription plan badge styling
  const getSubscriptionBadgeClass = (plan) => {
    const planLower = (plan || '').toLowerCase();
    if (planLower.includes('annual') || planLower === 'annual') {
      return 'bg-purple-100 text-purple-800';
    } else if (planLower.includes('6 months') || planLower === '6 months') {
      return 'bg-blue-100 text-blue-800';
    } else if (planLower.includes('3 months') || planLower === '3 months') {
      return 'bg-green-100 text-green-800';
    } else if (planLower === 'free') {
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Filter landlords based on search term
  const filteredLandlords = landlords.filter(landlord => {
    const searchLower = searchTerm.toLowerCase();
    const email = (landlord.email || '').toLowerCase();
    const displayName = (landlord.displayName || '').toLowerCase();
    const firstName = (landlord.firstName || '').toLowerCase();
    const lastName = (landlord.lastName || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
    const propertyName = (landlord.propertyName || '').toLowerCase();
    const subscriptionPlan = getSubscriptionPlan(landlord).toLowerCase();
    
    return (
      email.includes(searchLower) ||
      displayName.includes(searchLower) ||
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      fullName.includes(searchLower) ||
      propertyName.includes(searchLower) ||
      subscriptionPlan.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Landlords Management</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by email, name, property, or subscription..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {landlords.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No landlords found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLandlords.length === 0 && searchTerm ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No landlords found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredLandlords.map((landlord) => {
                const isEnabled = landlord.enabled !== false; // Default to true if not set
                const isUpdating = updating[landlord.id] || false;
                const subscriptionPlan = getSubscriptionPlan(landlord);
                const expirationDate = formatExpirationDate(landlord);
                const isExpired = isSubscriptionExpired(landlord);
                
                return (
                  <tr key={landlord.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {landlord.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {landlord.displayName || 
                       `${landlord.firstName || ''} ${landlord.lastName || ''}`.trim() || 
                       'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {landlord.propertyName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                        isEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-lg ${getSubscriptionBadgeClass(subscriptionPlan)}`}>
                        {subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={isExpired ? 'text-red-600 font-semibold' : ''}>
                        {expirationDate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleStatus(landlord.id, isEnabled)}
                        disabled={isUpdating}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                          isEnabled
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isUpdating 
                          ? 'Updating...' 
                          : isEnabled 
                            ? 'Disable' 
                            : 'Enable'}
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminLandlordList;

