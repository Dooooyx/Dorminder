import React, { useState, useRef, useEffect } from 'react';

const BillingFilterDropdown = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState({
    dateRange: {
      from: currentFilters?.dateRange?.from || '2023-09-14',
      to: currentFilters?.dateRange?.to || '2023-09-14'
    },
    activityType: currentFilters?.activityType || 'Time Charge',
    status: currentFilters?.status || 'Pending',
    keywordSearch: currentFilters?.keywordSearch || ''
  });

  const dropdownRef = useRef(null);

  const activityTypeOptions = [
    { value: 'Time Charge', label: 'Time Charge' },
    { value: 'Rent Payment', label: 'Rent Payment' },
    { value: 'Utility Bill', label: 'Utility Bill' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Deposit', label: 'Deposit' }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Partially Paid', label: 'Partially Paid' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Paid', label: 'Paid' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
      dateRange: { from: '2023-09-14', to: '2023-09-14' },
      activityType: 'Time Charge',
      status: 'Pending',
      keywordSearch: ''
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-90 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900">Filter</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Date Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <button
                onClick={() => setFilters(prev => ({ ...prev, dateRange: { from: '2023-09-14', to: '2023-09-14' } }))}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Reset
              </button>
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">From:</label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.dateRange.from}
                    onChange={(e) => handleFilterChange('dateRange', 'from', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">To:</label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.dateRange.to}
                    onChange={(e) => handleFilterChange('dateRange', 'to', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Type */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Activity Type</label>
                <button
                  onClick={() => handleDirectFilterChange('activityType', 'Time Charge')}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Reset
                </button>
              </div>
              <div className="relative">
                <select
                  value={filters.activityType}
                  onChange={(e) => handleDirectFilterChange('activityType', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                >
                  {activityTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <button
                  onClick={() => handleDirectFilterChange('status', 'Pending')}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Reset
                </button>
              </div>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleDirectFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Keyword Search */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Keyword Search</label>
                <button
                  onClick={() => handleDirectFilterChange('keywordSearch', '')}
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Reset
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={filters.keywordSearch}
                  onChange={(e) => handleDirectFilterChange('keywordSearch', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingFilterDropdown;
