import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { tenantDataService } from '../services/tenantDataService';

// Custom hook to handle common tenant data fetching logic
export const useTenantData = () => {
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get current user
  const currentUser = authService.getCurrentUser();
  const userName = tenantData?.firstName || 'Tenant';

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!currentUser) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const result = await tenantDataService.getTenantData(currentUser.uid);
        
        if (result.success) {
          setTenantData(result.data);
        } else {
          setError(result.error || 'Failed to load tenant data');
        }
      } catch (err) {
        console.error('Error fetching tenant data:', err);
        setError('Failed to load tenant data');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [currentUser]);

  return {
    tenantData,
    loading,
    error,
    userName,
    currentUser
  };
};
