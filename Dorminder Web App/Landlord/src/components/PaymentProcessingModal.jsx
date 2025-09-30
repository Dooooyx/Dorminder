import React, { useState, useEffect } from 'react';
import { billingService } from '../services/billingService';

const PaymentProcessingModal = ({ isOpen, onClose, bill, onPaymentProcessed }) => {
  const [paymentData, setPaymentData] = useState({
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (bill && isOpen) {
      setPaymentData(prev => ({
        ...prev,
        paymentAmount: bill.remainingBalance || bill.totalAmount
      }));
    }
  }, [bill, isOpen]);

  const handleInputChange = (field) => (e) => {
    setPaymentData(prev => ({
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
    
    if (!paymentData.paymentAmount || parseFloat(paymentData.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Please enter a valid payment amount';
    }
    
    if (parseFloat(paymentData.paymentAmount) > (bill?.remainingBalance || bill?.totalAmount || 0)) {
      newErrors.paymentAmount = 'Payment amount cannot exceed remaining balance';
    }
    
    if (!paymentData.paymentDate) {
      newErrors.paymentDate = 'Please select payment date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm() && !isProcessing && bill) {
      setIsProcessing(true);
      
      try {
        const result = await billingService.processPayment(
          bill.id,
          parseFloat(paymentData.paymentAmount),
          new Date(paymentData.paymentDate)
        );
        
        if (result.success) {
          // Call the callback to refresh data
          if (onPaymentProcessed) {
            onPaymentProcessed({
              ...bill,
              status: result.data.status,
              remainingBalance: result.data.remainingBalance,
              paymentAmount: result.data.totalPaid
            });
          }
          
          // Reset form and close modal
          setPaymentData({
            paymentAmount: '',
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Cash',
            notes: ''
          });
          setErrors({});
          onClose();
          
          alert(`Payment processed successfully! Status: ${result.data.status}`);
        } else {
          throw new Error(result.error);
        }
        
      } catch (error) {
        console.error('Error processing payment:', error);
        alert(`Error processing payment: ${error.message}`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClose = () => {
    setPaymentData({
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !bill) return null;

  const remainingBalance = bill.remainingBalance || bill.totalAmount;
  const isFullPayment = parseFloat(paymentData.paymentAmount) >= remainingBalance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-md bg-opacity-30"
        onClick={handleClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Process Payment</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Bill Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Bill Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tenant:</span>
                <span className="font-medium">{bill.tenantName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">Room {bill.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Period:</span>
                <span className="font-medium">{bill.billingPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">₱{bill.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Balance:</span>
                <span className="font-medium text-red-600">₱{remainingBalance?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₱</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={remainingBalance}
                  value={paymentData.paymentAmount}
                  onChange={handleInputChange('paymentAmount')}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.paymentAmount && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentData.paymentDate}
                onChange={handleInputChange('paymentDate')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.paymentDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.paymentDate && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentData.paymentMethod}
                onChange={handleInputChange('paymentMethod')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="GCash">GCash</option>
                <option value="PayMaya">PayMaya</option>
                <option value="Check">Check</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={paymentData.notes}
                onChange={handleInputChange('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about this payment..."
              />
            </div>

            {/* Payment Status Preview */}
            {paymentData.paymentAmount && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Payment Status Preview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Payment Amount:</span>
                    <span className="font-medium">₱{parseFloat(paymentData.paymentAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Remaining After Payment:</span>
                    <span className="font-medium">
                      ₱{Math.max(0, remainingBalance - parseFloat(paymentData.paymentAmount || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">New Status:</span>
                    <span className={`font-medium ${isFullPayment ? 'text-green-600' : 'text-orange-600'}`}>
                      {isFullPayment ? 'Paid' : 'Partially Paid'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingModal;
