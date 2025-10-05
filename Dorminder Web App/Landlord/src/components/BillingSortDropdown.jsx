import React, { useState, useRef, useEffect } from 'react';

const BillingSortDropdown = ({ isOpen, onClose, onApplySort, currentSort }) => {
  const [sortOptions, setSortOptions] = useState({
    date: currentSort?.date || 'descending',
    amount: currentSort?.amount || 'descending',
    tenant: currentSort?.tenant || 'a-z',
    room: currentSort?.room || 'a-z',
    status: currentSort?.status || 'a-z'
  });

  const dropdownRef = useRef(null);

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

  const handleSortChange = (field, value) => {
    setSortOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setSortOptions({
      date: 'descending',
      amount: 'descending',
      tenant: 'a-z',
      room: 'a-z',
      status: 'a-z'
    });
  };

  const handleApply = () => {
    onApplySort(sortOptions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900">Sort</h3>
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
        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Date</label>
            <div className="space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="date"
                  value="ascending"
                  checked={sortOptions.date === 'ascending'}
                  onChange={(e) => handleSortChange('date', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Ascending</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="date"
                  value="descending"
                  checked={sortOptions.date === 'descending'}
                  onChange={(e) => handleSortChange('date', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Descending</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Amount</label>
            <div className="space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="amount"
                  value="ascending"
                  checked={sortOptions.amount === 'ascending'}
                  onChange={(e) => handleSortChange('amount', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Low to High</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="amount"
                  value="descending"
                  checked={sortOptions.amount === 'descending'}
                  onChange={(e) => handleSortChange('amount', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">High to Low</span>
              </label>
            </div>
          </div>

          {/* Tenant */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Tenant</label>
            <div className="space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tenant"
                  value="a-z"
                  checked={sortOptions.tenant === 'a-z'}
                  onChange={(e) => handleSortChange('tenant', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">A-Z</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tenant"
                  value="z-a"
                  checked={sortOptions.tenant === 'z-a'}
                  onChange={(e) => handleSortChange('tenant', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Z-A</span>
              </label>
            </div>
          </div>

          {/* Room */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Room</label>
            <div className="space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="room"
                  value="a-z"
                  checked={sortOptions.room === 'a-z'}
                  onChange={(e) => handleSortChange('room', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">A-Z</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="room"
                  value="z-a"
                  checked={sortOptions.room === 'z-a'}
                  onChange={(e) => handleSortChange('room', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Z-A</span>
              </label>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
            <div className="space-y-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="a-z"
                  checked={sortOptions.status === 'a-z'}
                  onChange={(e) => handleSortChange('status', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">A-Z</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="z-a"
                  checked={sortOptions.status === 'z-a'}
                  onChange={(e) => handleSortChange('status', e.target.value)}
                  className="w-3 h-3 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Z-A</span>
              </label>
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

export default BillingSortDropdown;



