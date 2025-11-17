import React, { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import GenerateBillModal from '../components/GenerateBillModal';
import PaymentProcessingModal from '../components/PaymentProcessingModal';
import BillingActionMenu from '../components/BillingActionMenu';
import BillingFilterDropdown from '../components/BillingFilterDropdown';
import BillingSortDropdown from '../components/BillingSortDropdown';
import { useAuth } from '../context/AuthContext';
import { billingService } from '../services/billingService';
import icSort from '../assets/icons/ic_sort.png';
import icFilter from '../assets/icons/ic_filter.png';
import icPayment from '../assets/icons/ic_payment.png';

const Billings = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortOptions, setSortOptions] = useState({
    date: 'descending',
    amount: 'descending',
    tenant: 'a-z',
    room: 'a-z',
    status: 'a-z'
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [billToDelete, setBillToDelete] = useState(null);
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

  // Filter and sort bills
  const filteredBillings = bills.filter(bill => {
    // Search filter
    const matchesSearch = !searchTerm || 
      bill.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.roomNumber?.toString().includes(searchTerm) ||
      bill.billingPeriod?.toLowerCase().includes(searchTerm.toLowerCase());

    // Additional filters
    const matchesStatus = !filters.status || bill.status === filters.status;
    const matchesActivityType = !filters.activityType || bill.activityType === filters.activityType;
    const matchesKeywordSearch = !filters.keywordSearch || 
      bill.tenantName?.toLowerCase().includes(filters.keywordSearch.toLowerCase()) ||
      bill.roomNumber?.toString().includes(filters.keywordSearch) ||
      bill.billingPeriod?.toLowerCase().includes(filters.keywordSearch.toLowerCase());
    
    // Date range filter
    const billDate = bill.dueDate ? new Date(bill.dueDate.seconds ? bill.dueDate.seconds * 1000 : bill.dueDate) : new Date();
    const matchesDateRange = (!filters.dateRange?.from || billDate >= new Date(filters.dateRange.from)) &&
                            (!filters.dateRange?.to || billDate <= new Date(filters.dateRange.to));

    return matchesSearch && matchesStatus && matchesActivityType && matchesKeywordSearch && matchesDateRange;
  }).sort((a, b) => {
    // Apply sorting
    let comparison = 0;
    
    // Date sorting
    if (sortOptions.date) {
      const dateA = a.dueDate ? new Date(a.dueDate.seconds ? a.dueDate.seconds * 1000 : a.dueDate) : new Date(0);
      const dateB = b.dueDate ? new Date(b.dueDate.seconds ? b.dueDate.seconds * 1000 : b.dueDate) : new Date(0);
      comparison = sortOptions.date === 'ascending' ? dateA - dateB : dateB - dateA;
    }
    
    // Amount sorting
    if (sortOptions.amount && comparison === 0) {
      comparison = sortOptions.amount === 'ascending' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    }
    
    // Tenant name sorting
    if (sortOptions.tenant && comparison === 0) {
      const nameA = a.tenantName || '';
      const nameB = b.tenantName || '';
      comparison = sortOptions.tenant === 'a-z' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    }
    
    // Room number sorting
    if (sortOptions.room && comparison === 0) {
      const roomA = a.roomNumber || '';
      const roomB = b.roomNumber || '';
      comparison = sortOptions.room === 'a-z' ? roomA.toString().localeCompare(roomB.toString()) : roomB.toString().localeCompare(roomA.toString());
    }
    
    // Status sorting
    if (sortOptions.status && comparison === 0) {
      const statusA = a.status || '';
      const statusB = b.status || '';
      comparison = sortOptions.status === 'a-z' ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
    }
    
    return comparison;
  });

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
    // Show success popup
    setSuccessMessage('Bill generated successfully!');
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };


  const handleProcessPayment = (bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleApplySort = (newSortOptions) => {
    setSortOptions(newSortOptions);
  };

  const handleBillUpdate = (message) => {
    loadBills(); // Reload bills when status is updated
    if (message) {
      setSuccessMessage(message);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
  };

  const handleBillError = (message) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
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

  const handlePaymentSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const handlePaymentError = (message) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  const handleDeleteBill = (billId) => {
    setBillToDelete(billId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteBill = async () => {
    if (!billToDelete) return;
    
    setShowDeleteConfirmModal(false);
    try {
      const result = await billingService.deleteBill(billToDelete);
      if (result.success) {
        setSuccessMessage('Bill deleted successfully!');
        setShowSuccessPopup(true);
        loadBills(); // Reload bills list
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      } else {
        setErrorMessage(`Failed to delete bill: ${result.error}`);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error deleting bill:', error);
      setErrorMessage(`Error deleting bill: ${error.message}`);
      setShowErrorPopup(true);
    } finally {
      setBillToDelete(null);
    }
  };

       const getStatusButton = (status) => {
         const baseClasses = "inline-flex items-center justify-center px-3 py-1 text-base font-medium min-w-[70px] h-6 text-white";
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
          <TopNav title="" />
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
    <div className="min-h-screen" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Top Bar */}
      <TopNav title="Billings" />
      
      {/* Main Content Area */}
      <div className="ml-64 pt-20 min-h-screen" style={{ backgroundColor: '#F0F5FA' }}>
        {/* Main Content - Scrollable */}
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-6 mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Billings</h2>
            <p className="text-gray-600 ">Manage tenant dues</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="flex items-center space-x-1">
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setIsFilterDropdownOpen(!isFilterDropdownOpen);
                            setIsSortDropdownOpen(false); // Close sort when opening filter
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Filter bills"
                        >
                          <img src={icFilter} alt="Filter" className="w-4 h-4" />
                        </button>
                    <BillingFilterDropdown
                      isOpen={isFilterDropdownOpen}
                      onClose={() => setIsFilterDropdownOpen(false)}
                      onApplyFilters={handleApplyFilters}
                      currentFilters={filters}
                    />
                  </div>
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setIsSortDropdownOpen(!isSortDropdownOpen);
                            setIsFilterDropdownOpen(false); // Close filter when opening sort
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Sort bills"
                        >
                          <img src={icSort} alt="Sort" className="w-4 h-4" />
                        </button>
                        <BillingSortDropdown
                          isOpen={isSortDropdownOpen}
                          onClose={() => setIsSortDropdownOpen(false)}
                          onApplySort={handleApplySort}
                          currentSort={sortOptions}
                        />
                      </div>
                    </div>
                  </div>
              </div>
              <div className="flex space-x-3">
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

               {/* Desktop Table View */}
               <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[600px]">
                 <div className="overflow-x-auto flex-1">
                   <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Due
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                      Room {bill.roomNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                      {bill.tenantName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                      {bill.billingPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                      {formatCurrency(bill.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                      {bill.dueDate ? new Date(bill.dueDate.seconds ? bill.dueDate.seconds * 1000 : bill.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusButton(bill.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                      <div className="flex items-center space-x-2">
                        {bill.status !== 'Paid' && (
                          <button 
                            onClick={() => handleProcessPayment(bill)}
                            className="text-green-600 hover:text-green-800 transition-all duration-200 hover:scale-110"
                            title="Process Payment"
                          >
                            <img src={icPayment} alt="Process Payment" className="h-6 w-6" />
                          </button>
                        )}
                        <BillingActionMenu 
                          bill={bill} 
                          onUpdate={handleBillUpdate}
                          onError={handleBillError}
                          onDelete={handleDeleteBill}
                          onClose={() => {}} // Action menu handles its own closing
                        />
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Inside table */}
          <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
            <div className="flex-1 flex items-center justify-between">
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
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
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
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
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
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Success!
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {successMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Error
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {errorMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowErrorPopup(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Bill Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-xl border border-gray-200 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Bill</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this bill? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setBillToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBill}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Billings;