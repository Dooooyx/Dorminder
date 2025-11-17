import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuperAdminLandlordList from '../SuperAdminComponents/SuperAdminLandlordList';
import logoImage from '../assets/logo/logo_dorminder.png';

const SuperAdmin = () => {
  const { authService } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="Dorminder Logo" 
                className="h-12 w-auto"
              />
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Manage landlord accounts. Disabled landlords cannot log in to the system.
          </p>
        </div>
        
        <SuperAdminLandlordList />
      </div>
    </div>
  );
};

export default SuperAdmin;

