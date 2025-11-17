import React, { useState, useEffect } from 'react';
import { superAdminService } from '../services/superAdminService';

const SuperAdminLandlordList = () => {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});

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
        <h2 className="text-2xl font-bold text-gray-800">Landlords Management</h2>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {landlords.map((landlord) => {
                const isEnabled = landlord.enabled !== false; // Default to true if not set
                const isUpdating = updating[landlord.id] || false;
                
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
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminLandlordList;

