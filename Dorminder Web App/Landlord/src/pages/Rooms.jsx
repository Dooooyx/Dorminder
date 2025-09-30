import React, { useState, useEffect, useCallback } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import AddRoomModal from '../components/AddRoomModal';
import RoomDetailsModal from '../components/RoomDetailsModal';
import RoomActionsMenu from '../components/RoomActionsMenu';
import SortModal from '../components/SortModal';
import { roomService } from '../services/roomService';
import { tenantService } from '../services/tenantService';
import { useAuth } from '../context/AuthContext';

const Rooms = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isRoomDetailsModalOpen, setIsRoomDetailsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [sortOptions, setSortOptions] = useState({
    roomNumber: 'Ascending',
    tenantName: '',
    leaseEndDate: '',
    status: ''
  });
  const [rooms, setRooms] = useState([]);
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

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // Get rooms for the property
      const roomsResult = await roomService.getRoomsByProperty(user.uid);
      console.log('Raw rooms data from database:', roomsResult);
      
      if (roomsResult.success) {
        // Get tenants to populate tenant information
        const tenantsResult = await tenantService.getTenantsByProperty(user.uid);
        const tenants = tenantsResult.success ? tenantsResult.data : [];
        
        // Combine room and tenant data
        const roomsWithTenants = roomsResult.data.map(room => {
          const tenant = tenants.find(t => t.roomId === room.id);
          // Determine status based on whether tenant is assigned
          const status = tenant ? 'Occupied' : 'Vacant';
          return {
            // Include all room data for the details modal
            ...room,
            // Override/add tenant-specific data for the table display
            tenant: tenant ? `${tenant.firstName} ${tenant.lastName}` : '',
            leaseDates: tenant ? `${new Date(tenant.leaseStartDate).toLocaleDateString()} - ${new Date(tenant.leaseEndDate).toLocaleDateString()}` : '',
            status: status,
            tenantId: tenant ? tenant.id : null
          };
        });
        
        setRooms(roomsWithTenants);
      } else {
        setError(roomsResult.error || 'Failed to load rooms');
        console.error('Error loading rooms:', roomsResult.error);
      }
    } catch (error) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load rooms on component mount
  useEffect(() => {
    if (!authLoading && user) {
      loadRooms();
    }
  }, [authLoading, user, loadRooms]);

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center justify-center px-3 py-1 text-xs font-medium min-w-[70px] h-6";
    switch (status) {
      case 'Occupied':
        return `${baseClasses} text-white`;
      case 'Vacant':
        return `${baseClasses} text-white`;
      case 'Maintenance':
        return `${baseClasses} text-white`;
      default:
        return `${baseClasses} text-white`;
    }
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRooms.length === rooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(rooms.map(room => room.id));
    }
  };

  const getSortedRooms = () => {
    let sortedRooms = [...rooms];

    // Always apply default room number sorting (ascending by default)
    const roomNumberSort = sortOptions.roomNumber || 'Ascending';
    sortedRooms.sort((a, b) => {
      // Extract numbers from room numbers (e.g., "Room 300" -> 300)
      const aNum = parseInt(a.roomNumber.replace(/\D/g, '')) || 0;
      const bNum = parseInt(b.roomNumber.replace(/\D/g, '')) || 0;
      
      // If numbers are equal, sort by the full room number string
      if (aNum === bNum) {
        return a.roomNumber.localeCompare(b.roomNumber);
      }
      
      return roomNumberSort === 'Ascending' ? aNum - bNum : bNum - aNum;
    });

    if (sortOptions.tenantName) {
      sortedRooms.sort((a, b) => {
        const aName = a.tenant || '';
        const bName = b.tenant || '';
        if (sortOptions.tenantName === 'A-Z') {
          return aName.localeCompare(bName);
        } else {
          return bName.localeCompare(aName);
        }
      });
    }

    if (sortOptions.leaseEndDate) {
      sortedRooms.sort((a, b) => {
        const aDate = new Date(a.leaseDates.split(' - ')[1] || '9999-12-31');
        const bDate = new Date(b.leaseDates.split(' - ')[1] || '9999-12-31');
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
        'Show Vacant': 'Vacant',
        'Show Occupied': 'Occupied',
        'Show Maintenance': 'Maintenance'
      };
      const targetStatus = statusMap[sortOptions.status];
      if (targetStatus) {
        sortedRooms = sortedRooms.filter(room => room.status === targetStatus);
      }
    }

    // Apply search filter
    if (searchTerm) {
      sortedRooms = sortedRooms.filter(room =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return sortedRooms;
  };

  const handleApplySort = (newSortOptions) => {
    setSortOptions(newSortOptions);
  };

  const handleReset = () => {
    // Reset search term
    setSearchTerm('');
    
    // Reset sort options to default
    setSortOptions({
      roomNumber: 'Ascending',
      tenantName: '',
      leaseEndDate: '',
      status: ''
    });
    
    // Clear selected rooms
    setSelectedRooms([]);
  };

  const handleAddRoom = async (roomData) => {
    try {
      // The room is already created in the modal, just refresh the list
      await loadRooms();
      console.log('Room added and list refreshed');
    } catch (error) {
      console.error('Error refreshing room list:', error);
    }
  };

  const handleViewRoom = (room) => {
    console.log('Room data being passed to modal:', room);
    setSelectedRoom(room);
    setIsRoomDetailsModalOpen(true);
  };

  const handleEditRoom = async (updatedRoom) => {
    try {
      // Update the room in the local state
      setRooms(prev => prev.map(room => 
        room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
      ));
      console.log('Room updated successfully:', updatedRoom);
    } catch (error) {
      console.error('Error updating room in local state:', error);
    }
  };

  const handleDeleteRooms = async () => {
    if (selectedRooms.length > 0) {
      try {
        // Delete rooms from database
        const deletePromises = selectedRooms.map(roomId => 
          roomService.deleteRoom(roomId)
        );
        
        const results = await Promise.all(deletePromises);
        const failedDeletes = results.filter(result => !result.success);
        
        if (failedDeletes.length === 0) {
          // Update local state only after successful deletion
          setRooms(prev => prev.filter(room => !selectedRooms.includes(room.id)));
          setSelectedRooms([]);
          alert(`Successfully deleted ${selectedRooms.length} room(s)`);
        } else {
          alert(`Failed to delete ${failedDeletes.length} room(s)`);
        }
      } catch (error) {
        console.error('Error deleting rooms:', error);
        alert('Error deleting rooms. Please try again.');
      }
    }
  };


  const handleReassignRoom = (room) => {
    console.log('Reassign room:', room);
    // TODO: Implement reassign room functionality
    alert(`Reassigning room: ${room.roomNumber}`);
  };

  const handleRemoveRoom = async (room) => {
    console.log('Remove room:', room);
    if (window.confirm(`Are you sure you want to remove ${room.roomNumber}?`)) {
      try {
        const result = await roomService.deleteRoom(room.id);
        
        if (result.success) {
          // Update local state only after successful deletion
          setRooms(prev => prev.filter(r => r.id !== room.id));
          alert(`Successfully deleted room ${room.roomNumber}`);
        } else {
          alert(`Failed to delete room: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Error deleting room. Please try again.');
      }
    }
  };

  const handleSyncRoomStatus = async () => {
    try {
      if (!user) {
        alert('User not authenticated');
        return;
      }

      const result = await roomService.syncRoomStatus(user.uid);
      if (result.success) {
        alert('Room statuses synced successfully!');
        // Reload rooms to show updated statuses
        await loadRooms();
      } else {
        alert(`Failed to sync room statuses: ${result.error}`);
      }
    } catch (error) {
      console.error('Error syncing room status:', error);
      alert('Error syncing room statuses');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Newsreader, serif' }}>
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F0F5FA' }}>
        {/* Top Bar */}
        <TopNav title="Room Management" />

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Rooms</h2>
            <p className="text-gray-600">Manage room details, assign tenants, and monitor leases.</p>
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
                  onClick={handleSyncRoomStatus}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sync Status</span>
                </button>
                <button 
                  onClick={() => setIsAddRoomModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Room</span>
                </button>
                <button 
                  onClick={handleDeleteRooms}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                  disabled={selectedRooms.length === 0}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8 text-center">
              <div className="text-gray-500">Loading rooms...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <div className="text-red-800">{error}</div>
              <button 
                onClick={loadRooms}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Rooms Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="overflow-x-auto flex-1">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRooms.length === getSortedRooms().length && getSortedRooms().length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lease Dates
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
                  {getSortedRooms().map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRooms.includes(room.id)}
                          onChange={() => handleRoomSelect(room.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                        {room.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                        {room.tenant || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                        {room.leaseDates || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">
                        ₱{room.monthlyRent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={getStatusBadge(room.status)} 
                          style={{ 
                            borderRadius: '5px',
                            backgroundColor: room.status === 'Occupied' ? '#61BD45' : 
                                           room.status === 'Vacant' ? '#9498A0' : 
                                           room.status === 'Maintenance' ? '#EE6C4D' : '#9498A0'
                          }}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium">
                        <div className="flex space-x-3">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <RoomActionsMenu 
                            room={room}
                            onView={handleViewRoom}
                            onReassign={handleReassignRoom}
                            onRemove={handleRemoveRoom}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 flex-shrink-0">
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
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">10</span> results
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

      {/* Add Room Modal */}
      <AddRoomModal 
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAddRoom={handleAddRoom}
      />

      {/* Room Details Modal */}
      <RoomDetailsModal
        isOpen={isRoomDetailsModalOpen}
        onClose={() => setIsRoomDetailsModalOpen(false)}
        room={selectedRoom}
        onEdit={handleEditRoom}
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

export default Rooms;
