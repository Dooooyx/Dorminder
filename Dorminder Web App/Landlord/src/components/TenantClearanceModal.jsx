import React, { useState, useEffect } from 'react';

const TenantClearanceModal = ({ tenant, onClearanceComplete, onCancel }) => {
  const [clearanceChecks, setClearanceChecks] = useState({
    noUnpaidBalance: false,
    noPropertyDamage: false,
    keysReturned: false,
    roomCleaned: false,
    noPendingRequests: false,
    utilitiesSettled: false
  });

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate progress
  const totalChecks = Object.keys(clearanceChecks).length;
  const checkedCount = Object.values(clearanceChecks).filter(Boolean).length;
  const progress = (checkedCount / totalChecks) * 100;

  // Determine clearance status
  const getClearanceStatus = () => {
    if (checkedCount === 0) return 'Not Started';
    if (checkedCount === totalChecks) return 'Cleared';
    return 'Pending Clearance';
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Cleared':
        return 'bg-green-100 text-green-800';
      case 'Pending Clearance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Started':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle checkbox
  const toggleCheck = (key) => {
    setClearanceChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle submit
  const handleSubmit = async () => {
    const status = getClearanceStatus();
    
    // Prevent submission if nothing is checked
    if (status === 'Not Started') {
      alert('Please check at least one clearance item before proceeding.');
      return;
    }

    // Warn if incomplete
    if (status === 'Pending Clearance') {
      const confirmed = window.confirm(
        '⚠️ Warning: Not all clearance items are checked.\n\n' +
        'The tenant will be marked as "Inactive" with "Pending Clearance" status.\n' +
        'The tenant record will be preserved until all items are cleared.\n\n' +
        'Do you want to proceed?'
      );
      
      if (!confirmed) return;
    } else {
      // Confirm full clearance
      const confirmed = window.confirm(
        '✅ All clearance items are checked.\n\n' +
        'The tenant will be fully removed from the system.\n' +
        'The room will be set back to "Vacant" status.\n\n' +
        'Do you want to proceed?'
      );
      
      if (!confirmed) return;
    }

    setIsSubmitting(true);

    const clearanceData = {
      checks: clearanceChecks,
      status,
      notes,
      clearedAt: new Date().toISOString(),
      checkedCount,
      totalCount: totalChecks
    };

    try {
      await onClearanceComplete(clearanceData);
    } catch (error) {
      console.error('Error in clearance completion:', error);
      alert('An error occurred while processing the clearance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = getClearanceStatus();

  const checklistItems = [
    {
      key: 'noUnpaidBalance',
      icon: '💰',
      title: 'No Unpaid Balance',
      description: 'All rent and fees have been fully paid'
    },
    {
      key: 'noPropertyDamage',
      icon: '🏠',
      title: 'No Property Damage',
      description: 'Room and property are in good condition'
    },
    {
      key: 'keysReturned',
      icon: '🔑',
      title: 'Keys Returned',
      description: 'All room and facility keys returned'
    },
    {
      key: 'roomCleaned',
      icon: '✨',
      title: 'Room Cleaned',
      description: 'Room has been cleaned and inspected'
    },
    {
      key: 'noPendingRequests',
      icon: '🔧',
      title: 'No Pending Requests',
      description: 'All maintenance requests resolved'
    },
    {
      key: 'utilitiesSettled',
      icon: '💡',
      title: 'Utilities Settled',
      description: 'All utility bills have been paid'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Tenant Clearance
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {tenant?.firstName} {tenant?.lastName} - Room {tenant?.roomNumber}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {checkedCount} / {totalChecks}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  progress === 100 ? 'bg-green-600' :
                  progress > 0 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Please verify all clearance items before removing this tenant.
              {' '}
              {status === 'Not Started' && 'Check at least one item to proceed.'}
              {status === 'Pending Clearance' && 'Unchecked items will mark the tenant as "Pending Clearance".'}
              {status === 'Cleared' && 'All items are checked. The tenant will be fully removed.'}
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-6">
            {checklistItems.map((item) => (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`
                  flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${clearanceChecks[item.key]
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={clearanceChecks[item.key]}
                    onChange={() => toggleCheck(item.key)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about the clearance process..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          {/* Warning for incomplete clearance */}
          {status === 'Pending Clearance' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    Incomplete Clearance
                  </p>
                  <p className="text-sm text-yellow-800">
                    Some clearance items are not checked. The tenant will be marked as 
                    "Inactive" with "Pending Clearance" status. The tenant record will 
                    be preserved until all items are resolved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success message for full clearance */}
          {status === 'Cleared' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    Ready for Removal
                  </p>
                  <p className="text-sm text-green-800">
                    All clearance items are verified. The tenant will be fully removed 
                    from the system and the room will be set to "Vacant" status.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || status === 'Not Started'}
              className={`
                px-6 py-2 rounded-lg font-medium transition-colors
                ${status === 'Cleared'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : status === 'Pending Clearance'
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                status === 'Cleared' ? 'Remove Tenant' : 
                status === 'Pending Clearance' ? 'Mark as Pending' :
                'Submit Clearance'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantClearanceModal;


