import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

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

  const categories = [
    'Maintenance',
    'Security',
    'Noise Complaint',
    'Property Damage',
    'Utility Issue',
    'Safety Concern',
    'Other'
  ];

  // Sample tenant data - in real app, this would come from tenantService
  const sampleTenants = [
    { id: 1, firstName: 'Maria', lastName: 'Perez', roomNumber: '101' },
    { id: 2, firstName: 'Luthar', lastName: 'Jimenez', roomNumber: '102' },
    { id: 3, firstName: 'John', lastName: 'Santos', roomNumber: '103' },
    { id: 4, firstName: 'Darl', lastName: 'Pantinople', roomNumber: '104' },
    { id: 5, firstName: 'Sarah', lastName: 'Johnson', roomNumber: '105' },
    { id: 6, firstName: 'Michael', lastName: 'Brown', roomNumber: '106' },
    { id: 7, firstName: 'Emily', lastName: 'Davis', roomNumber: '107' },
    { id: 8, firstName: 'David', lastName: 'Wilson', roomNumber: '108' },
  ];

  useEffect(() => {
    // Load tenants (in real app, this would be from tenantService)
    setTenants(sampleTenants);
    
    // Set reported by field with landlord name
    const landlordName = userData?.firstName ? userData.firstName : 'Landlord';
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
  }, [initialData, userData]);


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

      await onSubmit(incidentData);
    } catch (error) {
      console.error('Error submitting incident:', error);
      alert('Failed to create incident report');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? 'Edit Incident Report' : 'Create New Incident Report'}
      </h3>

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
            >
              <option value="">Select Room</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.roomNumber}>
                  Room {tenant.roomNumber}
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
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{loading ? 'Creating...' : (initialData ? 'Update Report' : 'Create Report')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentReportForm;
