import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { tenantService } from '../services/tenantService';

const IncidentReportForm = ({ onSubmit, onCancel, propertyId, initialData = null }) => {
  const { user } = useAuth();
  const { userData } = useProfile();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tenantName: '',
    roomNumber: '',
    reportedBy: '',
    estimatedCost: '',
  });

  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const categories = [
    'Maintenance',
    'Security',
    'Noise Complaint',
    'Property Damage',
    'Utility Issue',
    'Safety Concern',
    'Other'
  ];

  // Load real tenant data from tenantService
  const loadTenants = async () => {
    try {
      setLoadingTenants(true);
      const result = await tenantService.getTenantsByProperty(user?.uid || propertyId);
      if (result.success) {
        console.log('📋 Loaded tenants for incident report:', result.data);
        setTenants(result.data);
      } else {
        console.error('❌ Failed to load tenants:', result.error);
        setTenants([]);
      }
    } catch (error) {
      console.error('❌ Error loading tenants:', error);
      setTenants([]);
    } finally {
      setLoadingTenants(false);
    }
  };

  useEffect(() => {
    // Load real tenant data
    loadTenants();
    
    // Set reported by field with landlord name from ProfileContext
    const landlordName = userData?.firstName && userData?.lastName 
      ? `${userData.firstName} ${userData.lastName}`
      : (userData?.displayName || user?.displayName || 'Landlord');
    
    setFormData(prev => ({
      ...prev,
      reportedBy: `Landlord (${landlordName})`
    }));
    
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || '',
        tenantName: initialData.tenantName || '',
        roomNumber: initialData.roomNumber || '',
        reportedBy: `Landlord (${landlordName})`,
        estimatedCost: initialData.estimatedCost || '',
      });
    }
  }, [initialData, userData, user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomChange = (e) => {
    const roomNumber = e.target.value;
    
    if (roomNumber) {
      // Find the tenant for the selected room
      const tenant = tenants.find(t => t.roomNumber === roomNumber);
      if (tenant) {
        setFormData(prev => ({
          ...prev,
          roomNumber: roomNumber,
          tenantName: `${tenant.firstName} ${tenant.lastName}`
        }));
      }
    } else {
      // Clear both fields if no room selected
      setFormData(prev => ({
        ...prev,
        roomNumber: '',
        tenantName: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (!formData.roomNumber.trim()) {
      alert('Please select a room');
      return;
    }
    if (!formData.tenantName.trim()) {
      alert('Tenant name is required');
      return;
    }

    setLoading(true);
    
    try {
      const incidentData = {
        ...formData,
        propertyId,
        status: 'open',
        resolved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('🚨 Creating incident with data:', incidentData);
      console.log('🏢 PropertyId for incident:', propertyId);
      
      await onSubmit(incidentData);
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting incident:', error);
      alert('Failed to create incident report');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Incident Report' : 'Create New Incident Report'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {initialData ? 'Update incident details' : 'Document a new incident or issue'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Incident Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief description of the incident"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed information about the incident"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Room and Tenant Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number <span className="text-red-500">*</span>
            </label>
            <select
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleRoomChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loadingTenants}
            >
              <option value="">
                {loadingTenants ? 'Loading rooms...' : 'Select Room'}
              </option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.roomNumber}>
                  Room {tenant.roomNumber} - {tenant.firstName} {tenant.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="tenantName"
              value={formData.tenantName}
              readOnly
              placeholder="Auto-filled from room selection"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              required
            />
          </div>
        </div>

        {/* Reported By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reported By
          </label>
          <input
            type="text"
            name="reportedBy"
            value={formData.reportedBy}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Estimated Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Cost (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₱</span>
            <input
              type="number"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || loadingTenants}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || loadingTenants}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{loading ? 'Creating...' : (initialData ? 'Update Report' : 'Create Report')}</span>
          </button>
        </div>
      </form>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Success!
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Incident report created successfully!
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReportForm;
