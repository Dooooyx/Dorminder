import React, { useState } from 'react';
import { billingService } from '../services/billingService';

const BillingActionMenu = ({ bill, onUpdate, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const result = await billingService.updateBillStatus(bill.id, newStatus);
      if (result.success) {
        onUpdate();
        onClose();
        // Show success message
        alert(`✅ Bill status updated to ${newStatus}`);
      } else {
        alert(`❌ Failed to update status: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating bill status:', error);
      alert(`❌ Error updating status: ${error.message}`);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleProcessPayment = () => {
    onClose();
    // This will trigger the payment processing modal
    window.dispatchEvent(new CustomEvent('processPayment', { detail: bill }));
  };

  const handleViewDetails = () => {
    onClose();
    // This will trigger a bill details modal
    window.dispatchEvent(new CustomEvent('viewBillDetails', { detail: bill }));
  };

  const handleSendReminder = async () => {
    setLoading(true);
    try {
      // This would integrate with your email service
      alert(`📧 Reminder sent to ${bill.tenantName} for Room ${bill.roomNumber}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert(`❌ Failed to send reminder: ${error.message}`);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleGenerateReceipt = () => {
    onClose();
    // This would generate a PDF receipt
    window.dispatchEvent(new CustomEvent('generateReceipt', { detail: bill }));
  };

  const getStatusOptions = () => {
    const currentStatus = bill.status;
    const options = [];

    switch (currentStatus) {
      case 'Pending':
        options.push(
          { value: 'Paid', label: 'Mark as Paid', icon: '✅', color: 'text-green-600' },
          { value: 'Overdue', label: 'Mark as Overdue', icon: '⚠️', color: 'text-red-600' },
          { value: 'Cancelled', label: 'Cancel Bill', icon: '❌', color: 'text-gray-600' }
        );
        break;
      case 'Overdue':
        options.push(
          { value: 'Paid', label: 'Mark as Paid', icon: '✅', color: 'text-green-600' },
          { value: 'Pending', label: 'Mark as Pending', icon: '⏳', color: 'text-yellow-600' },
          { value: 'Cancelled', label: 'Cancel Bill', icon: '❌', color: 'text-gray-600' }
        );
        break;
      case 'Paid':
        options.push(
          { value: 'Pending', label: 'Mark as Pending', icon: '⏳', color: 'text-yellow-600' },
          { value: 'Refunded', label: 'Mark as Refunded', icon: '💰', color: 'text-blue-600' }
        );
        break;
      case 'Cancelled':
        options.push(
          { value: 'Pending', label: 'Reactivate Bill', icon: '🔄', color: 'text-blue-600' }
        );
        break;
      default:
        options.push(
          { value: 'Paid', label: 'Mark as Paid', icon: '✅', color: 'text-green-600' },
          { value: 'Pending', label: 'Mark as Pending', icon: '⏳', color: 'text-yellow-600' },
          { value: 'Overdue', label: 'Mark as Overdue', icon: '⚠️', color: 'text-red-600' },
          { value: 'Cancelled', label: 'Cancel Bill', icon: '❌', color: 'text-gray-600' }
        );
    }

    return options;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        disabled={loading}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {/* Status Change Section */}
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Change Status
                </h3>
                {getStatusOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${option.color}`}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Actions Section */}
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Actions
                </h3>
                
                {bill.status !== 'Paid' && (
                  <button
                    onClick={handleProcessPayment}
                    className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>💳</span>
                    <span>Process Payment</span>
                  </button>
                )}
                
                <button
                  onClick={handleViewDetails}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <span>👁️</span>
                  <span>View Details</span>
                </button>
                
                {bill.status !== 'Paid' && bill.status !== 'Cancelled' && (
                  <button
                    onClick={handleSendReminder}
                    className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>📧</span>
                    <span>Send Reminder</span>
                  </button>
                )}
                
                {bill.status === 'Paid' && (
                  <button
                    onClick={handleGenerateReceipt}
                    className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span>🧾</span>
                    <span>Generate Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingActionMenu;





