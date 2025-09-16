import React, { useState, useEffect, useCallback } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import AddTenantModal from '../components/AddTenantModal';
import TenantActionsMenu from '../components/TenantActionsMenu';
import TenantDetailsModal from '../components/TenantDetailsModal';
import SortModal from '../components/SortModal';
import { tenantService } from '../services/tenantService';
import { roomService } from '../services/roomService';
import { useAuth } from '../context/AuthContext';

const Tenant = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isTenantDetailsModalOpen, setIsTenantDetailsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [sortOptions, setSortOptions] = useState({
    name: 'A-Z',
    roomNumber: '',
    leaseEndDate: '',
    status: ''
  });
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // Use user's UID as propertyId for now (in a real app, you'd have separate property management)
      const result = await tenantService.getTenantsByProperty(user.uid);
      
      if (result.success) {
        setTenants(result.data);
      } else {
        setError(result.error || 'Failed to load tenants');
        console.error('Error loading tenants:', result.error);
      }
    } catch (error) {
      setError('Failed to load tenants');
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load tenants on component mount
  useEffect(() => {
    if (!authLoading && user) {
      loadTenants();
    }
  }, [authLoading, user, loadTenants]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'Overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleTenantSelect = (tenantId) => {
    setSelectedTenants(prev => 
      prev.includes(tenantId) 
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTenants.length === tenants.length) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(tenants.map(tenant => tenant.id));
    }
  };

  const getSortedTenants = () => {
    let sortedTenants = [...tenants];

    // Always apply default name sorting (A-Z by default)
    const nameSort = sortOptions.name || 'A-Z';
    sortedTenants.sort((a, b) => {
      const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
      const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
      
      if (nameSort === 'A-Z') {
        return aName.localeCompare(bName);
      } else {
        return bName.localeCompare(aName);
      }
    });

    // Apply room number sorting if selected
    if (sortOptions.roomNumber) {
      sortedTenants.sort((a, b) => {
        const aNum = parseInt(a.roomNumber.replace(/\D/g, '')) || 0;
        const bNum = parseInt(b.roomNumber.replace(/\D/g, '')) || 0;
        
        if (aNum === bNum) {
          return a.roomNumber.localeCompare(b.roomNumber);
        }
        
        return sortOptions.roomNumber === 'Ascending' ? aNum - bNum : bNum - aNum;
      });
    }

    // Apply lease end date sorting if selected
    if (sortOptions.leaseEndDate) {
      sortedTenants.sort((a, b) => {
        const aDate = new Date(a.leaseEndDate);
        const bDate = new Date(b.leaseEndDate);
        
        if (sortOptions.leaseEndDate === 'Earliest → Latest') {
          return aDate - bDate;
        } else {
          return bDate - aDate;
        }
      });
    }

    // Apply status filter
    if (sortOptions.status) {
      const statusMap = {
        'Show Active': 'Active',
        'Show Inactive': 'Inactive',
        'Show Overdue': 'Overdue',
        'Show Pending': 'Pending'
      };
      const targetStatus = statusMap[sortOptions.status];
      if (targetStatus) {
        sortedTenants = sortedTenants.filter(tenant => tenant.status === targetStatus);
      }
    }

    // Apply search filter
    if (searchTerm) {
      sortedTenants = sortedTenants.filter(tenant =>
        `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return sortedTenants;
  };

  const handleApplySort = (newSortOptions) => {
    setSortOptions(newSortOptions);
  };

  const handleReset = () => {
    // Reset search term
    setSearchTerm('');
    
    // Reset sort options to default
    setSortOptions({
      name: 'A-Z',
      roomNumber: '',
      leaseEndDate: '',
      status: ''
    });
    
    // Clear selected tenants
    setSelectedTenants([]);
  };

  const handleAddTenant = async (tenantData) => {
    try {
      // The tenant is already created in the modal, just refresh the list
      await loadTenants();
      console.log('Tenant added and list refreshed');
    } catch (error) {
      console.error('Error refreshing tenant list:', error);
    }
  };

  const handleDeleteTenants = () => {
    if (selectedTenants.length > 0) {
      setTenants(prev => prev.filter(tenant => !selectedTenants.includes(tenant.id)));
      setSelectedTenants([]);
      console.log('Tenants deleted:', selectedTenants);
    }
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setIsTenantDetailsModalOpen(true);
  };

  const handleEditTenant = (tenant) => {
    console.log('Edit tenant:', tenant);
    // TODO: Implement edit tenant functionality
    alert(`Editing tenant: ${tenant.firstName} ${tenant.lastName}`);
  };

  const handleRemoveTenant = (tenant) => {
    console.log('Remove tenant:', tenant);
    if (window.confirm(`Are you sure you want to remove ${tenant.firstName} ${tenant.lastName}?`)) {
      setTenants(prev => prev.filter(t => t.id !== tenant.id));
    }
  };

  const handleSaveTenantDetails = (updatedData) => {
    if (selectedTenant) {
      setTenants(prev => prev.map(tenant => 
        tenant.id === selectedTenant.id 
          ? { 
              ...tenant, 
              firstName: updatedData.firstName,
              lastName: updatedData.lastName,
              middleInitial: updatedData.middleInitial,
              contactNumber: updatedData.contactNumber,
              emailAddress: updatedData.emailAddress,
              emergencyContact: updatedData.emergencyContact,
              roomNumber: updatedData.roomNumber,
              monthlyRent: updatedData.rentAmount,
              leaseStartDate: updatedData.leaseStartDate,
              leaseEndDate: updatedData.leaseEndDate
            }
          : tenant
      ));
      console.log('Tenant details updated:', updatedData);
    }
  };

  const handleDownloadContract = () => {
    if (selectedTenant) {
      console.log('Downloading lease contract for:', selectedTenant.firstName, selectedTenant.lastName);
      // TODO: Implement actual download functionality
      alert(`Downloading lease contract for ${selectedTenant.firstName} ${selectedTenant.lastName}`);
    }
  };

  const handleResetPassword = () => {
    if (selectedTenant) {
      console.log('Resetting password for:', selectedTenant.firstName, selectedTenant.lastName);
      // TODO: Implement actual password reset functionality
      alert(`Password reset for ${selectedTenant.firstName} ${selectedTenant.lastName}`);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        {/* Top Bar */}
        <TopNav title="Tenant Management" />

        {/* Main Content */}
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tenants</h2>
            <p className="text-gray-600">Manage tenant profiles, track leases, and monitor rental status.</p>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button 
                      onClick={() => setIsSortModalOpen(true)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsAddTenantModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Tenant</span>
                </button>
                <button 
                  onClick={handleDeleteTenants}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                  disabled={selectedTenants.length === 0}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8 text-center">
              <div className="text-gray-500">Loading tenants...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="text-red-800">{error}</div>
              <button 
                onClick={loadTenants}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Tenants Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedTenants.length === getSortedTenants().length && getSortedTenants().length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lease Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Rent
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
                  {getSortedTenants().map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedTenants.includes(tenant.id)}
                          onChange={() => handleTenantSelect(tenant.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-lg font-medium text-gray-900">
                            {tenant.firstName} {tenant.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {tenant.idNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg text-gray-900">{tenant.email}</div>
                        <div className="text-sm text-gray-500">{tenant.contactNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                        {tenant.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                        {tenant.leaseStartDate} - {tenant.leaseEndDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                        ₱{tenant.monthlyRent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(tenant.status)}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleEditTenant(tenant)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <TenantActionsMenu 
                            tenant={tenant}
                            onView={handleViewTenant}
                            onEdit={handleEditTenant}
                            onRemove={handleRemoveTenant}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </a>
                <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </a>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{getSortedTenants().length}</span> of <span className="font-medium">{getSortedTenants().length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">01</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">02</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">03</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">04</a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Add Tenant Modal */}
      <AddTenantModal 
        isOpen={isAddTenantModalOpen}
        onClose={() => setIsAddTenantModalOpen(false)}
        onAddTenant={handleAddTenant}
      />

      {/* Tenant Details Modal */}
      <TenantDetailsModal 
        isOpen={isTenantDetailsModalOpen}
        onClose={() => {
          setIsTenantDetailsModalOpen(false);
          setSelectedTenant(null);
        }}
        tenant={selectedTenant}
        onEdit={handleEditTenant}
        onSave={handleSaveTenantDetails}
        onDownloadContract={handleDownloadContract}
        onResetPassword={handleResetPassword}
      />

      {/* Sort Modal */}
      <SortModal 
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        onApplySort={handleApplySort}
        onReset={handleReset}
        currentSort={sortOptions}
      />
    </div>
  );
};

export default Tenant;