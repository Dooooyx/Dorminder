import React, { useState } from 'react';

const BillingFilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState({
    dateRange: {
      from: currentFilters?.dateRange?.from || '',
      to: currentFilters?.dateRange?.to || ''
    },
    status: currentFilters?.status || '',
    amountRange: {
      min: currentFilters?.amountRange?.min || '',
      max: currentFilters?.amountRange?.max || ''
    },
    roomNumber: currentFilters?.roomNumber || '',
    tenantName: currentFilters?.tenantName || ''
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Refunded', label: 'Refunded' }
  ];

  const handleFilterChange = (section, field, value) => {
    setFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDirectFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      dateRange: { from: '', to: '' },
      status: '',
      amountRange: { min: '', max: '' },
      roomNumber: '',
      tenantName: ''
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From:</label>
                  <input
                    type="date"
                    value={filters.dateRange.from}
                    onChange={(e) => handleFilterChange('dateRange', 'from', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To:</label>
                  <input
                    type="date"
                    value={filters.dateRange.to}
                    onChange={(e) => handleFilterChange('dateRange', 'to', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => setFilters(prev => ({ ...prev, dateRange: { from: '', to: '' } }))}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                Reset
              </button>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleDirectFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleDirectFilterChange('status', '')}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                Reset
              </button>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min Amount:</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.amountRange.min}
                    onChange={(e) => handleFilterChange('amountRange', 'min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max Amount:</label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={filters.amountRange.max}
                    onChange={(e) => handleFilterChange('amountRange', 'max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => setFilters(prev => ({ ...prev, amountRange: { min: '', max: '' } }))}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                Reset
              </button>
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
              <input
                type="text"
                placeholder="Enter room number"
                value={filters.roomNumber}
                onChange={(e) => handleDirectFilterChange('roomNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleDirectFilterChange('roomNumber', '')}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                Reset
              </button>
            </div>

            {/* Tenant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tenant Name</label>
              <input
                type="text"
                placeholder="Enter tenant name"
                value={filters.tenantName}
                onChange={(e) => handleDirectFilterChange('tenantName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleDirectFilterChange('tenantName', '')}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingFilterModal;



