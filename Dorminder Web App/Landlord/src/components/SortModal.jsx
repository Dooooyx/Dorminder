import React, { useState } from 'react';

const SortModal = ({ isOpen, onClose, onApplySort, onReset, currentSort }) => {
  const [sortOptions, setSortOptions] = useState({
    roomNumber: currentSort?.roomNumber || 'Ascending',
    tenantName: currentSort?.tenantName || '',
    leaseEndDate: currentSort?.leaseEndDate || '',
    status: currentSort?.status || ''
  });

  const handleOptionChange = (category, value) => {
    setSortOptions(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleApply = () => {
    onApplySort(sortOptions);
    onClose();
  };

  const handleReset = () => {
    // Reset modal's internal state
    setSortOptions({
      roomNumber: 'Ascending',
      tenantName: '',
      leaseEndDate: '',
      status: ''
    });
    
    // Call parent's reset function to reset search and other states
    if (onReset) {
      onReset();
    }
    
    // Close the modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0"    
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800">Sort</h2>
          </div>
        </div>

        {/* Sort Options */}
        <div className="px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Name</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="name"
                  value=""
                  checked={sortOptions.name === ''}
                  onChange={(e) => handleOptionChange('name', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">No sorting</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="name"
                  value="A-Z"
                  checked={sortOptions.name === 'A-Z'}
                  onChange={(e) => handleOptionChange('name', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">A-Z</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="name"
                  value="Z-A"
                  checked={sortOptions.name === 'Z-A'}
                  onChange={(e) => handleOptionChange('name', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Z-A</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Room Number */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Room Number</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="roomNumber"
                  value=""
                  checked={sortOptions.roomNumber === ''}
                  onChange={(e) => handleOptionChange('roomNumber', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">No sorting</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="roomNumber"
                  value="Ascending"
                  checked={sortOptions.roomNumber === 'Ascending'}
                  onChange={(e) => handleOptionChange('roomNumber', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Ascending</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="roomNumber"
                  value="Descending"
                  checked={sortOptions.roomNumber === 'Descending'}
                  onChange={(e) => handleOptionChange('roomNumber', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Descending</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Lease End Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Lease End Date</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="leaseEndDate"
                  value=""
                  checked={sortOptions.leaseEndDate === ''}
                  onChange={(e) => handleOptionChange('leaseEndDate', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">No sorting</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="leaseEndDate"
                  value="Earliest → Latest"
                  checked={sortOptions.leaseEndDate === 'Earliest → Latest'}
                  onChange={(e) => handleOptionChange('leaseEndDate', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Earliest → Latest</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="leaseEndDate"
                  value="Latest → Earliest"
                  checked={sortOptions.leaseEndDate === 'Latest → Earliest'}
                  onChange={(e) => handleOptionChange('leaseEndDate', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Latest → Earliest</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value=""
                  checked={sortOptions.status === ''}
                  onChange={(e) => handleOptionChange('status', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Show All</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Show Active"
                  checked={sortOptions.status === 'Show Active'}
                  onChange={(e) => handleOptionChange('status', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Show Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Show Inactive"
                  checked={sortOptions.status === 'Show Inactive'}
                  onChange={(e) => handleOptionChange('status', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Show Inactive</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Show Overdue"
                  checked={sortOptions.status === 'Show Overdue'}
                  onChange={(e) => handleOptionChange('status', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Show Overdue</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Show Pending"
                  checked={sortOptions.status === 'Show Pending'}
                  onChange={(e) => handleOptionChange('status', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Show Pending</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortModal;
