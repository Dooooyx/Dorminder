import React, { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import GenerateBillModal from '../components/GenerateBillModal';
import PaymentProcessingModal from '../components/PaymentProcessingModal';
import MonthlyRentResetModal from '../components/MonthlyRentResetModal';
import { useAuth } from '../context/AuthContext';
import { billingService } from '../services/billingService';
import icSort from '../assets/icons/ic_sort.png';
import icFilter from '../assets/icons/ic_filter.png';

const Billings = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isMonthlyRentResetModalOpen, setIsMonthlyRentResetModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const { user } = useAuth();

  // Sample billing data - in real app, this would come from Firebase/Firestore
  const sampleBillings = [
    {
      id: 1,
      roomNumber: '101',
      tenant: 'Maria L. Perez',
      billingPeriod: 'September 2025',
      totalDue: 5000,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 2,
      roomNumber: '102',
      tenant: 'Luthar D. Jimenez',
      billingPeriod: 'September 2025',
      totalDue: 5000,
      dueDate: 'Sep 30, 2025',
      status: 'Overdue'
    },
    {
      id: 3,
      roomNumber: '103',
      tenant: 'John S. Santos',
      billingPeriod: 'September 2025',
      totalDue: 5500,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 4,
      roomNumber: '104',
      tenant: 'Darl P. Pantinople',
      billingPeriod: 'September 2025',
      totalDue: 4500,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 5,
      roomNumber: '105',
      tenant: 'Sarah M. Johnson',
      billingPeriod: 'September 2025',
      totalDue: 5000,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 6,
      roomNumber: '106',
      tenant: 'Michael R. Brown',
      billingPeriod: 'September 2025',
      totalDue: 5200,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 7,
      roomNumber: '107',
      tenant: 'Emily L. Davis',
      billingPeriod: 'September 2025',
      totalDue: 4800,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 8,
      roomNumber: '108',
      tenant: 'David K. Wilson',
      billingPeriod: 'September 2025',
      totalDue: 5000,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 9,
      roomNumber: '109',
      tenant: 'Lisa A. Garcia',
      billingPeriod: 'September 2025',
      totalDue: 5300,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 10,
      roomNumber: '110',
      tenant: 'Robert T. Martinez',
      billingPeriod: 'September 2025',
      totalDue: 5000,
      dueDate: 'Sep 30, 2025',
      status: 'Paid'
    },
    {
      id: 11,
      roomNumber: '111',
      tenant: 'Jennifer H. Anderson',
      billingPeriod: 'August 2025',
      totalDue: 5000,
      dueDate: 'Aug 31, 2025',
      status: 'Paid'
    },
    {
      id: 12,
      roomNumber: '112',
      tenant: 'Christopher J. Taylor',
      billingPeriod: 'August 2025',
      totalDue: 5500,
      dueDate: 'Aug 31, 2025',
      status: 'Paid'
    }
  ];

  useEffect(() => {
    loadBills();
  }, [user]);

  const loadBills = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await billingService.getBillsByLandlord(user.uid);
      if (result.success) {
        setBills(result.data);
        console.log('Loaded bills:', result.data);
      } else {
        console.error('Error loading bills:', result.error);
        // Start with empty array instead of sample data
        setBills([]);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
      // Start with empty array instead of sample data
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter billings based on search term
  const filteredBillings = bills.filter(bill =>
    (bill.tenantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bill.roomNumber || '').toString().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBillings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBillings = filteredBillings.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleGenerateBill = (billData) => {
    console.log('New bill generated:', billData);
    // Reload bills to show the new one
    loadBills();
  };

  const handleMonthlyRentReset = () => {
    // Reload bills to get the latest data from database
    loadBills();
    setIsMonthlyRentResetModalOpen(false);
  };

  const handleProcessPayment = (bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentProcessed = (updatedBill) => {
    console.log('Payment processed, updating bill:', updatedBill);
    // Update the bill in the local state
    setBills(prev => prev.map(bill => 
      bill.id === updatedBill.id ? { ...bill, ...updatedBill } : bill
    ));
    setIsPaymentModalOpen(false);
    setSelectedBill(null);
    // Reload bills to ensure data is fresh
    loadBills();
  };

       const getStatusButton = (status) => {
         const baseClasses = "inline-flex items-center justify-center px-3 py-1 text-xs font-medium min-w-[70px] h-6 text-white";
         switch (status) {
           case 'Paid':
             return <span className={baseClasses} style={{ borderRadius: '5px', backgroundColor: '#61BD45' }}>Paid</span>;
           case 'Overdue':
             return <span className={baseClasses} style={{ borderRadius: '5px', backgroundColor: '#EE6C4D' }}>Overdue</span>;
           default:
             return <span className={baseClasses} style={{ borderRadius: '5px', backgroundColor: '#9498A0' }}>{status}</span>;
         }
       };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '₱0';
    }
    return `₱${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
        <SideNav />
        <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F0F5FA' }}>
          <TopNav title="Billings" />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading billings...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      <SideNav />
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F0F5FA' }}>
        <TopNav title="Billings" />
        
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billings</h1>
            <p className="text-gray-600">Manage tenant dues</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Q Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <img src={icFilter} alt="Filter" className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <img src={icSort} alt="Sort" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsMonthlyRentResetModalOpen(true)}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#FF6B35' }}
              >
                🔄 Monthly Reset
              </button>
              <button 
                onClick={() => setIsGenerateBillModalOpen(true)}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#40526A' }}
              >
                + Generate New Bill
              </button>
            </div>
            </div>
          </div>

               {/* Billings Table */}
               <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[600px]">
                 <div className="overflow-x-auto flex-1">
                   <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Room #</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Tenant</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Billing Period</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Total Due</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Due Date</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Actions</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBillings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-2">No bills found</p>
                        <p className="text-gray-500 mb-4">Generate your first bill to get started</p>
                        <button 
                          onClick={() => setIsGenerateBillModalOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Generate New Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentBillings.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Room {bill.roomNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.tenantName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.billingPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bill.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.dueDate ? new Date(bill.dueDate.seconds ? bill.dueDate.seconds * 1000 : bill.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusButton(bill.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {bill.status !== 'Paid' && (
                          <button 
                            onClick={() => handleProcessPayment(bill)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Process Payment"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 flex-shrink-0">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredBillings.length)}</span> of{' '}
                  <span className="font-medium">{filteredBillings.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === pageNum ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {String(pageNum).padStart(2, '0')}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {String(totalPages).padStart(2, '0')}
                    </button>
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Generate Bill Modal */}
      <GenerateBillModal
        isOpen={isGenerateBillModalOpen}
        onClose={() => setIsGenerateBillModalOpen(false)}
        onGenerateBill={handleGenerateBill}
      />

      {/* Payment Processing Modal */}
      <PaymentProcessingModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bill={selectedBill}
        onPaymentProcessed={handlePaymentProcessed}
      />

      {/* Monthly Rent Reset Modal */}
      <MonthlyRentResetModal
        isOpen={isMonthlyRentResetModalOpen}
        onClose={() => setIsMonthlyRentResetModalOpen(false)}
        onResetComplete={handleMonthlyRentReset}
      />
    </div>
  );
};

export default Billings;