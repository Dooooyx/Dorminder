import React, { useState, useEffect } from 'react';
import { billingService } from '../services/billingService';
import { useAuth } from '../context/AuthContext';

const MonthlyRentResetModal = ({ isOpen, onClose, onResetComplete }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState('');
  const [billsExist, setBillsExist] = useState(false);
  const [existingBillsCount, setExistingBillsCount] = useState(0);
  const [checkingBills, setCheckingBills] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      checkExistingBills();
    }
  }, [isOpen, user]);

  const checkExistingBills = async () => {
    if (!user) return;
    
    setCheckingBills(true);
    try {
      const currentDate = new Date();
      const billingPeriod = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      setCurrentBillingPeriod(billingPeriod);
      
      const result = await billingService.checkMonthlyRentBillsExist(user.uid, billingPeriod);
      
      if (result.success) {
        setBillsExist(result.data.exists);
        setExistingBillsCount(result.data.count);
      }
    } catch (error) {
      console.error('Error checking existing bills:', error);
    } finally {
      setCheckingBills(false);
    }
  };

  const handleResetRent = async () => {
    if (!user || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const result = await billingService.generateMonthlyRentBillsForAllTenants(user.uid);
      
      if (result.success) {
        const { total, successful, failed, results } = result.data;
        
        // Show detailed results
        let message = `Monthly rent bills generated successfully!\n\n`;
        message += `Total tenants: ${total}\n`;
        message += `Successful: ${successful}\n`;
        message += `Failed: ${failed}\n\n`;
        
        if (failed > 0) {
          message += `Failed tenants:\n`;
          results.filter(r => !r.success).forEach(r => {
            message += `• ${r.tenantName}: ${r.error}\n`;
          });
        }
        
        alert(message);
        
        // Call callback to refresh data
        if (onResetComplete) {
          onResetComplete();
        }
        
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error resetting monthly rent:', error);
      alert(`Error generating monthly rent bills: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setBillsExist(false);
    setExistingBillsCount(0);
    setCurrentBillingPeriod('');
    onClose();
  };

  if (!isOpen) return null;

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
            <h2 className="text-xl font-bold text-gray-800">Monthly Rent Reset</h2>
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
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">What this does:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Generates monthly rent bills for all active tenants</li>
                <li>• Sets due date to the 1st of next month</li>
                <li>• Creates bills with current month as billing period</li>
                <li>• Each tenant gets a bill for their monthly rent amount</li>
              </ul>
            </div>

            {checkingBills ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-2">Checking existing bills...</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Current Status:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Period:</span>
                    <span className="font-medium">{currentBillingPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Existing Bills:</span>
                    <span className={`font-medium ${billsExist ? 'text-orange-600' : 'text-green-600'}`}>
                      {billsExist ? `${existingBillsCount} bills found` : 'No bills found'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {billsExist && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-800">
                      Bills Already Exist
                    </h3>
                    <div className="mt-2 text-sm text-orange-700">
                      <p>Monthly rent bills for {currentBillingPeriod} already exist. Generating new bills will create duplicates.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
              type="button"
              onClick={handleResetRent}
              disabled={isProcessing || checkingBills}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Generating...' : 'Generate Monthly Bills'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRentResetModal;
