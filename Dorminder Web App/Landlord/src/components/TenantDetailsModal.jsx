import React, { useState } from 'react';
import ic_show from '../assets/icons/ic_show.png';
import ic_hide from '../assets/icons/ic_hide.png';
import { tenantService } from '../services/tenantService';

const TenantDetailsModal = ({ isOpen, onClose, tenant, onEdit, onSave, onDownloadContract, onResetPassword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Initialize edited data when modal opens
  React.useEffect(() => {
    if (isOpen && tenant) {
      setEditedData({
        firstName: tenant.firstName || '',
        lastName: tenant.lastName || '',
        middleInitial: tenant.middleInitial || '',
        contactNumber: tenant.contactNumber || '',
        emailAddress: tenant.email || '',
        emergencyContact: tenant.emergencyContact || '',
        roomNumber: tenant.roomNumber || '',
        rentAmount: tenant.monthlyRent || 0,
        leaseStartDate: tenant.leaseStartDate || '',
        leaseEndDate: tenant.leaseEndDate || '',
        loginEmail: tenant.email || '',
        password: '••••••' // Hidden password display
      });
    }
  }, [isOpen, tenant]);

  const handleInputChange = (field) => (e) => {
    setEditedData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    if (tenant) {
      setEditedData({
        firstName: tenant.firstName || '',
        lastName: tenant.lastName || '',
        middleInitial: tenant.middleInitial || '',
        contactNumber: tenant.contactNumber || '',
        emailAddress: tenant.email || '',
        emergencyContact: tenant.emergencyContact || '',
        roomNumber: tenant.roomNumber || '',
        rentAmount: tenant.monthlyRent || 0,
        leaseStartDate: tenant.leaseStartDate || '',
        leaseEndDate: tenant.leaseEndDate || '',
        loginEmail: tenant.email || '',
        password: '••••••'
      });
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await tenantService.updateTenantPassword(tenant.id, newPassword);
      
      if (result.success) {
        setPasswordSuccess('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setIsChangingPassword(false);
      } else {
        setPasswordError(result.error || 'Failed to update password');
      }
    } catch (error) {
      setPasswordError('Failed to update password');
      console.error('Error updating password:', error);
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button - Top Right Corner */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors z-10"
        >
          ×
        </button>

        {/* Header */}
        <div className="px-6 py-4 border-b mt-10 border-gray-100">
          <div className="flex justify-start items-start pr-8">
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1" style={{ fontFamily: 'Newsreader, serif', fontSize: '40px', fontWeight: '600' }}>
                {isEditing ? (
                  <div className="flex space-x-2 items-center">
                    <input
                      type="text"
                      value={editedData.firstName}
                      onChange={handleInputChange('firstName')}
                      className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-32"
                      style={{ fontFamily: 'Newsreader, serif', fontSize: '40px', fontWeight: '600' }}
                      placeholder="First"
                    />
                    <input
                      type="text"
                      value={editedData.middleInitial}
                      onChange={handleInputChange('middleInitial')}
                      className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-8 text-center"
                      maxLength="1"
                      style={{ fontFamily: 'Newsreader, serif', fontSize: '40px', fontWeight: '600' }}
                      placeholder="M"
                    />
                    <input
                      type="text"
                      value={editedData.lastName}
                      onChange={handleInputChange('lastName')}
                      className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-32"
                      style={{ fontFamily: 'Newsreader, serif', fontSize: '40px', fontWeight: '600' }}
                      placeholder="Last"
                    />
                  </div>
                ) : (
                  `${tenant.firstName} ${tenant.middleInitial ? tenant.middleInitial + '.' : ''} ${tenant.lastName}`
                )}
              </h2>
              <p className="text-[20px] text-gray-600 font-medium">
                Room #{tenant.roomNumber?.replace('Room ', '') || tenant.roomNumber}
              </p>
            </div>
            
            {/* Valid ID Placeholder - Right side of header */}
            <div className="flex flex-col items-center">
              <div className="w-40 h-26 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {tenant.idImage ? (
                  <img 
                    src={tenant.idImage} 
                    alt="ID" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 font-medium">Valid ID</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {isEditing ? (
            /* Edit Mode - Clean Form Layout */
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      value={editedData.contactNumber}
                      onChange={handleInputChange('contactNumber')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editedData.emailAddress}
                      onChange={handleInputChange('emailAddress')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="text"
                      value={editedData.emergencyContact}
                      onChange={handleInputChange('emergencyContact')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <input
                      type="text"
                      value={editedData.roomNumber}
                      onChange={handleInputChange('roomNumber')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rent Amount</label>
                    <input
                      type="number"
                      value={editedData.rentAmount}
                      onChange={handleInputChange('rentAmount')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Lease Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Lease Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lease Start Date</label>
                    <input
                      type="date"
                      value={editedData.leaseStartDate}
                      onChange={handleInputChange('leaseStartDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lease End Date</label>
                    <input
                      type="date"
                      value={editedData.leaseEndDate}
                      onChange={handleInputChange('leaseEndDate')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ fontSize: '20px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* View Mode - Original Layout */
            <div className="space-y-3">
              <div className="flex justify-start items-center py-1">
                <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Contact Number:</span>
                <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>+63 {tenant.contactNumber?.slice(1) || tenant.contactNumber}</span>
              </div>

              <div className="flex justify-start items-center py-1">
                <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Email Address:</span>
                <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>{tenant.email || 'Not provided'}</span>
              </div>

              <div className="flex justify-start items-center py-1">
                <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Emergency Contact:</span>
                <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>{tenant.emergencyContact}</span>
              </div>

              <div className="flex justify-start items-center py-1">
                <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Room Number:</span>
                <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>{tenant.roomNumber?.replace('Room ', '') || tenant.roomNumber}</span>
              </div>

              <div className="flex justify-start items-center py-1">
                <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Rent Amount:</span>
                <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>₱{tenant.monthlyRent?.toLocaleString()}/month</span>
              </div>

              <div className="flex justify-start items-center py-1">
                <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Lease Start Date:</span>
                <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>{new Date(tenant.leaseStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <div className="flex justify-start items-center py-1">
                <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Lease End Date:</span>
                <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>{new Date(tenant.leaseEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          )}

          {/* Login Information */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-bold text-gray-900 mb-4" style={{ fontSize: '20px' }}>Login Information</h3>
            
            {isEditing ? (
              /* Edit Mode - Clean Form Layout for Login */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Login Email</label>
                  <input
                    type="email"
                    value={editedData.loginEmail}
                    onChange={handleInputChange('loginEmail')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ fontSize: '20px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-gray-700 font-medium" style={{ fontSize: '20px' }}>
                        {showPassword ? 'Password not stored for security' : '••••••'}
                      </span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <img 
                          src={showPassword ? ic_hide : ic_show} 
                          alt={showPassword ? "Hide" : "Show"} 
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                      style={{ fontSize: '20px' }}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode - Original Layout for Login */
              <div className="space-y-3">
                <div className="flex justify-start items-center py-1">
                  <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Login Email:</span>
                  <span className="text-gray-700 font-medium ml-4" style={{ fontSize: '20px' }}>{tenant.email || 'Not provided'}</span>
                </div>

                <div className="flex justify-start items-center py-1">
                  <span className="font-bold text-gray-900" style={{ fontSize: '20px' }}>Password:</span>
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium" style={{ fontSize: '20px' }}>
                        {showPassword ? 'Password not stored for security' : '••••••'}
                      </span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <img 
                          src={showPassword ? ic_hide : ic_show} 
                          alt={showPassword ? "Hide" : "Show"} 
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="px-3 py-1 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                      style={{ fontSize: '20px' }}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Form */}
          {isChangingPassword && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
              
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {passwordSuccess}
                </div>
              )}
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {passwordError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={handleCancelPasswordChange}
                    className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Download Lease Contract */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <button
              onClick={onDownloadContract}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium underline" style={{ fontSize: '20px' }}>Download Lease Contract</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                style={{ fontSize: '20px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#61BD45] text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                style={{ fontSize: '20px' }}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              style={{ fontSize: '20px' }}
            >
              Edit Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsModal;
