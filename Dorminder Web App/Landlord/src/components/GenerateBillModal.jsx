import React, { useState, useEffect } from 'react';
import { billingService } from '../services/billingService';
import { tenantService } from '../services/tenantService';
import { useAuth } from '../context/AuthContext';

const GenerateBillModal = ({ isOpen, onClose, onGenerateBill }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tenantId: '',
    tenantName: '',
    roomNumber: '',
    billingPeriod: '',
    rentAmount: '',
    water: '',
    electricity: '',
    internet: '',
    others: '',
    totalDue: '',
    dueDate: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);

  // Load tenants when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadTenants();
    }
  }, [isOpen, user]);

  // Calculate total due whenever utilities change
  useEffect(() => {
    const rent = parseFloat(formData.rentAmount) || 0;
    const water = parseFloat(formData.water) || 0;
    const electricity = parseFloat(formData.electricity) || 0;
    const internet = parseFloat(formData.internet) || 0;
    const others = parseFloat(formData.others) || 0;
    
    const total = rent + water + electricity + internet + others;
    setFormData(prev => ({
      ...prev,
      totalDue: total.toFixed(2)
    }));
  }, [formData.rentAmount, formData.water, formData.electricity, formData.internet, formData.others]);

  const loadTenants = async () => {
    setLoadingTenants(true);
    try {
      const result = await tenantService.getTenantsByProperty(user.uid);
      if (result.success) {
        setTenants(result.data);
      } else {
        console.error('Error loading tenants:', result.error);
      }
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoadingTenants(false);
    }
  };

  const handleTenantSelect = (tenantId) => {
    const selectedTenant = tenants.find(t => t.id === tenantId);
    if (selectedTenant) {
      setFormData(prev => ({
        ...prev,
        tenantId: selectedTenant.userId, // Use userId (Firebase Auth UID) instead of document ID
        tenantName: `${selectedTenant.firstName} ${selectedTenant.lastName}`,
        roomNumber: selectedTenant.roomNumber || '',
        rentAmount: selectedTenant.monthlyRent || ''
      }));
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tenantName) newErrors.tenantName = 'Please select a tenant';
    if (!formData.billingPeriod) newErrors.billingPeriod = 'Please enter billing period';
    if (!formData.rentAmount) newErrors.rentAmount = 'Please enter rent amount';
    if (!formData.dueDate) newErrors.dueDate = 'Please select due date';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        // Prepare bill data
        const billData = {
          tenantId: formData.tenantId,
          tenantName: formData.tenantName,
          landlordId: user.uid,
          roomNumber: formData.roomNumber,
          billingPeriod: formData.billingPeriod,
          billType: 'Monthly Bill',
          totalAmount: parseFloat(formData.totalDue),
          remainingBalance: parseFloat(formData.totalDue),
          dueDate: new Date(formData.dueDate),
          description: formData.note || `Bill for ${formData.billingPeriod}`,
          items: [
            {
              description: 'Room Rental',
              amount: parseFloat(formData.rentAmount) || 0,
              type: 'rent'
            },
            ...(parseFloat(formData.water) > 0 ? [{
              description: 'Water',
              amount: parseFloat(formData.water),
              type: 'utility'
            }] : []),
            ...(parseFloat(formData.electricity) > 0 ? [{
              description: 'Electricity',
              amount: parseFloat(formData.electricity),
              type: 'utility'
            }] : []),
            ...(parseFloat(formData.internet) > 0 ? [{
              description: 'Internet',
              amount: parseFloat(formData.internet),
              type: 'utility'
            }] : []),
            ...(parseFloat(formData.others) > 0 ? [{
              description: 'Others',
              amount: parseFloat(formData.others),
              type: 'other'
            }] : [])
          ]
        };
        
        // Create bill in database
        const result = await billingService.createBill(billData);
        
        if (result.success) {
          // Call the callback with the form data
          if (onGenerateBill) {
            onGenerateBill({ ...formData, billId: result.billId });
          }
          
          // Reset form and close modal
          setFormData({
            tenantId: '',
            tenantName: '',
            roomNumber: '',
            billingPeriod: '',
            rentAmount: '',
            water: '',
            electricity: '',
            internet: '',
            others: '',
            totalDue: '',
            dueDate: '',
            note: ''
          });
          setErrors({});
          onClose();
          
          alert('Bill generated successfully!');
        } else {
          throw new Error(result.error);
        }
        
      } catch (error) {
        console.error('Error generating bill:', error);
        alert(`Error generating bill: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      tenantName: '',
      roomNumber: '',
      billingPeriod: '',
      rentAmount: '',
      water: '',
      electricity: '',
      internet: '',
      others: '',
      totalDue: '',
      dueDate: '',
      note: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-md bg-opacity-30"
        onClick={handleClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Generate New Bill</h2>
              <p className="text-gray-600 mt-1">Fill in the details to create a new billing record for a tenant or room.</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Tenant/Room Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tenant/Room Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant Name *
                </label>
                <select
                  value={formData.tenantId}
                  onChange={(e) => handleTenantSelect(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tenantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loadingTenants}
                >
                  <option value="">{loadingTenants ? 'Loading tenants...' : 'Select Tenant'}</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.firstName} {tenant.lastName} - Room {tenant.roomNumber}
                    </option>
                  ))}
                </select>
                {errors.tenantName && (
                  <p className="text-red-500 text-sm mt-1">{errors.tenantName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room # (auto-fill)
                </label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={handleInputChange('roomNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Auto-filled"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Period (Month/Year) *
                </label>
                <input
                  type="text"
                  value={formData.billingPeriod}
                  onChange={handleInputChange('billingPeriod')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.billingPeriod ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., September 2025"
                />
                {errors.billingPeriod && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingPeriod}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Amount *
                </label>
                <input
                  type="number"
                  value={formData.rentAmount}
                  onChange={handleInputChange('rentAmount')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rentAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.rentAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.rentAmount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Utilities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Utilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water: ₱
                </label>
                <input
                  type="number"
                  value={formData.water}
                  onChange={handleInputChange('water')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricity: ₱
                </label>
                <input
                  type="number"
                  value={formData.electricity}
                  onChange={handleInputChange('electricity')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internet: ₱
                </label>
                <input
                  type="number"
                  value={formData.internet}
                  onChange={handleInputChange('internet')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Others: ₱
                </label>
                <input
                  type="number"
                  value={formData.others}
                  onChange={handleInputChange('others')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Due: (auto calculated)
                </label>
                <input
                  type="text"
                  value={`₱${formData.totalDue}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange('dueDate')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note: (optional)
            </label>
            <textarea
              value={formData.note}
              onChange={handleInputChange('note')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Generating...' : 'Add Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateBillModal;
