import React, { useState, useEffect, useRef } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import AnnouncementForm from '../components/AnnouncementForm';
import IncidentReportForm from '../components/IncidentReportForm';
import { incidentService } from '../services/incidentService';
import { FirestoreService } from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

const ToolsReports = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showIncidentSuccessPopup, setShowIncidentSuccessPopup] = useState(false);
  const [showIncidentErrorPopup, setShowIncidentErrorPopup] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteAnnouncementModal, setShowDeleteAnnouncementModal] = useState(false);
  const [incidentSuccessMessage, setIncidentSuccessMessage] = useState('');
  const [incidentErrorMessage, setIncidentErrorMessage] = useState('');
  const [announcementSuccessMessage, setAnnouncementSuccessMessage] = useState('');
  const [announcementErrorMessage, setAnnouncementErrorMessage] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const { user } = useAuth();
  const { userData } = useProfile();
  const firestoreService = new FirestoreService();
  const incidentUnsubscribeRef = useRef(null);
  const announcementUnsubscribeRef = useRef(null);

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'incidents', label: 'Incident Reports', icon: '📋' }
  ];

  useEffect(() => {
    loadAnnouncements();
    if (activeTab === 'incidents') {
      loadIncidents();
    }
    
    // Set up real-time listeners
    setupRealTimeListeners();
    
    // Cleanup listeners on unmount
    return () => {
      if (incidentUnsubscribeRef.current) {
        incidentUnsubscribeRef.current();
      }
      if (announcementUnsubscribeRef.current) {
        announcementUnsubscribeRef.current();
      }
    };
  }, [activeTab, user?.uid]);

  // Set up real-time listeners for live updates
  const setupRealTimeListeners = () => {
    if (!user?.uid) return;
    
    const propertyId = user?.propertyId || user?.uid;
    
    // Real-time listener for incidents
    try {
      const incidentsQuery = query(
        collection(db, 'incidents'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      
      incidentUnsubscribeRef.current = onSnapshot(incidentsQuery, (snapshot) => {
        const incidentData = [];
        snapshot.forEach((doc) => {
          incidentData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        console.log('📋 Real-time incident update:', incidentData.length, 'incidents');
        setIncidents(incidentData);
      }, (error) => {
        console.error('❌ Real-time incident listener error:', error);
      });
    } catch (error) {
      console.error('❌ Error setting up incident listener:', error);
    }
    
    // Real-time listener for announcements
    try {
      const announcementsQuery = query(
        collection(db, 'announcements'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      
      announcementUnsubscribeRef.current = onSnapshot(announcementsQuery, (snapshot) => {
        const announcementData = [];
        snapshot.forEach((doc) => {
          announcementData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        console.log('📢 Real-time announcement update:', announcementData.length, 'announcements');
        setAnnouncements(announcementData);
      }, (error) => {
        console.error('❌ Real-time announcement listener error:', error);
      });
    } catch (error) {
      console.error('❌ Error setting up announcement listener:', error);
    }
  };

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const propertyId = user?.propertyId || 'default';
      console.log('🏢 Landlord loading announcements for propertyId:', propertyId);
      
      const result = await firestoreService.getAnnouncementsByProperty(propertyId);
      console.log('📢 Landlord announcements result:', result);
      
      if (result.success) {
        console.log('✅ Landlord loaded announcements:', result.data);
        setAnnouncements(result.data);
      } else {
        console.error('❌ Error loading announcements:', result.error);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('❌ Error loading announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const loadIncidents = async () => {
    try {
      setLoading(true);
      // Get propertyId from user - should match what's used when creating incidents
      const propertyId = user?.propertyId || user?.uid || 'default';
      console.log('🔍 Loading incidents for propertyId:', propertyId);
      console.log('👤 User data:', { uid: user?.uid, propertyId: user?.propertyId });
      
      const incidentsList = await incidentService.getIncidentsByProperty(propertyId);
      console.log('📋 Loaded incidents:', incidentsList.length, 'incidents');
      setIncidents(incidentsList);
    } catch (error) {
      console.error('❌ Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnnouncement = async (announcementData) => {
    try {
      setIsCreatingAnnouncement(true);
      
      const propertyId = user?.propertyId || 'default';
      const landlordId = user?.uid || 'default';
      
      console.log('🏢 Landlord saving announcement with propertyId:', propertyId);
      console.log('👤 Landlord user data:', user);
      console.log('👤 Landlord profile data:', userData);
      console.log('🔍 Firebase Auth displayName:', user?.displayName);
      console.log('🔍 Profile firstName:', userData?.firstName);
      console.log('🔍 Profile lastName:', userData?.lastName);
      
      // Use the correct landlord name from ProfileContext instead of Firebase Auth
      const landlordName = userData?.firstName && userData?.lastName 
        ? `${userData.firstName} ${userData.lastName}`
        : (userData?.displayName || user?.displayName || 'Landlord');
      
      console.log('✅ Final landlord name to use:', landlordName);
      
      const announcementToSave = {
        ...announcementData,
        propertyId,
        landlordId,
        landlordName,
        postedBy: landlordName
      };
      
      console.log('💾 Announcement to save:', announcementToSave);

      let result;
      if (editingAnnouncement) {
        result = await firestoreService.updateAnnouncement(editingAnnouncement.id, announcementToSave);
      } else {
        result = await firestoreService.createAnnouncement(announcementToSave);
      }

      if (result.success) {
        // Reload announcements from Firestore
        await loadAnnouncements();
        setIsFormOpen(false);
        setEditingAnnouncement(null);
        
        // Show success popup
        setShowSuccessPopup(true);
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      } else {
        alert('Failed to save announcement: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    } finally {
      setIsCreatingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = (id) => {
    setSelectedAnnouncementId(id);
    setShowDeleteAnnouncementModal(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!selectedAnnouncementId) return;
    
    setShowDeleteAnnouncementModal(false);
    try {
      const result = await firestoreService.deleteAnnouncement(selectedAnnouncementId);
      if (result.success) {
        await loadAnnouncements();
        setAnnouncementSuccessMessage('Announcement deleted successfully!');
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      } else {
        setAnnouncementErrorMessage('Failed to delete announcement: ' + result.error);
        setShowIncidentErrorPopup(true); // Reuse error popup
        setTimeout(() => {
          setShowIncidentErrorPopup(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setAnnouncementErrorMessage('Failed to delete announcement');
      setShowIncidentErrorPopup(true); // Reuse error popup
      setTimeout(() => {
        setShowIncidentErrorPopup(false);
      }, 3000);
    } finally {
      setSelectedAnnouncementId(null);
    }
  };

  const handleCreateIncident = async (incidentData) => {
    try {
      console.log('📝 handleCreateIncident called with:', incidentData);
      const incidentId = await incidentService.createIncident(incidentData);
      console.log('✅ Incident created with ID:', incidentId);
      setIsIncidentFormOpen(false);
      console.log('🔄 Loading incidents after creation...');
      await loadIncidents();
      setIncidentSuccessMessage('Incident report created successfully!');
      setShowIncidentSuccessPopup(true);
      setTimeout(() => {
        setShowIncidentSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('❌ Error creating incident:', error);
      setIncidentErrorMessage('Failed to create incident report');
      setShowIncidentErrorPopup(true);
      throw error;
    }
  };

  const handleResolveIncident = (incidentId) => {
    setSelectedIncidentId(incidentId);
    setResolutionNotes('');
    setShowResolveModal(true);
  };

  const confirmResolveIncident = async () => {
    if (!selectedIncidentId) return;
    
    if (!resolutionNotes.trim()) {
      setIncidentErrorMessage('Please enter resolution notes');
      setShowIncidentErrorPopup(true);
      return;
    }

    setShowResolveModal(false);
    try {
      await incidentService.resolveIncident(selectedIncidentId, resolutionNotes);
      loadIncidents();
      setIncidentSuccessMessage('Incident marked as resolved!');
      setShowIncidentSuccessPopup(true);
      setTimeout(() => {
        setShowIncidentSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error resolving incident:', error);
      setIncidentErrorMessage('Failed to resolve incident');
      setShowIncidentErrorPopup(true);
    } finally {
      setSelectedIncidentId(null);
      setResolutionNotes('');
    }
  };

  const handleDeleteIncident = (incidentId) => {
    setSelectedIncidentId(incidentId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteIncident = async () => {
    if (!selectedIncidentId) return;
    
    setShowDeleteConfirmModal(false);
    try {
      await incidentService.deleteIncident(selectedIncidentId);
      loadIncidents();
      setIncidentSuccessMessage('Incident report deleted successfully!');
      setShowIncidentSuccessPopup(true);
      setTimeout(() => {
        setShowIncidentSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting incident:', error);
      setIncidentErrorMessage('Failed to delete incident');
      setShowIncidentErrorPopup(true);
    } finally {
      setSelectedIncidentId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeRange = (announcement) => {
    const parts = [];
    
    // Date range
    if (announcement.fromDate && announcement.untilDate) {
      const fromDate = formatDate(announcement.fromDate);
      const untilDate = formatDate(announcement.untilDate);
      parts.push(`${fromDate} to ${untilDate}`);
    } else if (announcement.fromDate) {
      parts.push(formatDate(announcement.fromDate));
    }
    
    // Time range
    if (announcement.fromTime && announcement.untilTime) {
      parts.push(`${announcement.fromTime} to ${announcement.untilTime}`);
    } else if (announcement.fromTime) {
      parts.push(`from ${announcement.fromTime}`);
    } else if (announcement.untilTime) {
      parts.push(`until ${announcement.untilTime}`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'No time specified';
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'open' && !incident.resolved) ||
                         (filterStatus === 'resolved' && incident.resolved);
    return matchesSearch && matchesFilter;
  });

  const renderAnnouncements = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading announcements...</p>
        </div>
      );
    }

    if (announcements.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Announcements Yet</h3>
          <p className="text-gray-600 mb-6">Create your first announcement to inform your tenants</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Announcement
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Manage Announcements</h3>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create Announcement
          </button>
        </div>

        <div className="space-y-4">
          {announcements.map(announcement => (
            <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 {formatDate(announcement.createdAt?.toDate?.() || announcement.createdAt || announcement.date)}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    ⏰ {formatTimeRange(announcement)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                    {announcement.status}
                  </span>
                  <button
                    onClick={() => {
                      setEditingAnnouncement(announcement);
                      setIsFormOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{announcement.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderIncidents = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading incident reports...</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
            <button
              onClick={() => setIsIncidentFormOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              + Report Incident
            </button>
          </div>
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No Incidents Found' : 'No Incident Reports'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria to find incidents' 
                : 'No incidents have been reported yet. Create your first incident report to get started.'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setIsIncidentFormOpen(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
              >
                Report First Incident
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredIncidents.map(incident => (
              <div key={incident.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-red-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{incident.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status?.toUpperCase()}
                      </span>
                      {incident.severity && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-base">
                      <div className="flex items-center space-x-1 text-gray-700">
                        <span className="text-blue-500 text-lg">👤</span>
                        <span className="font-medium">{incident.tenantName}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-700">
                        <span className="text-green-500 text-lg">🏠</span>
                        <span className="font-medium">Room {incident.roomNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-700">
                        <span className="text-purple-500 text-lg">📂</span>
                        <span className="font-medium">{incident.category}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-700">
                        <span className="text-orange-500 text-lg">📅</span>
                        <span className="font-medium">{formatDate(incident.createdAt?.toDate?.() || incident.createdAt)}</span>
                      </div>
                    </div>
                    {incident.estimatedCost && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-500 font-medium">💰</span>
                          <span className="font-semibold text-red-700">
                            Estimated Cost: ₱{parseFloat(incident.estimatedCost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!incident.resolved && (
                      <button
                        onClick={() => handleResolveIncident(incident.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Resolve</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteIncident(incident.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete incident"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{incident.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Reported by:</span> {incident.reportedBy}
                  </div>
                  {incident.resolved && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                      ✓ RESOLVED
                    </span>
                  )}
                </div>
                {incident.resolved && incident.resolutionNotes && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <strong className="text-green-900">Resolution Notes:</strong>
                    </div>
                    <p className="text-green-800 leading-relaxed">{incident.resolutionNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'announcements':
        return renderAnnouncements();
      case 'incidents':
        return renderIncidents();
      default:
        return renderAnnouncements();
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Newsreader, serif' }}>
      <SideNav />
      <TopNav title="Tools & Reports" />
      
      <div className="ml-64 pt-20 min-h-screen" style={{ backgroundColor: '#F0F5FA' }}>
        <div className="p-8">
          <div className="mb-6 mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tools & Reports</h2>
            <p className="text-gray-600">Manage announcements and incident reports</p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Announcement Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AnnouncementForm
              onSave={handleSaveAnnouncement}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingAnnouncement(null);
              }}
              initialData={editingAnnouncement}
              isLoading={isCreatingAnnouncement}
            />
          </div>
        </div>
      )}

      {/* Incident Report Form Modal */}
      {isIncidentFormOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <IncidentReportForm
              onSubmit={handleCreateIncident}
              onCancel={() => setIsIncidentFormOpen(false)}
              propertyId={user?.propertyId || user?.uid || 'default'}
            />
          </div>
        </div>
      )}

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
              {announcementSuccessMessage || 'Announcement posted successfully!'}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setAnnouncementSuccessMessage('');
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Success Popup */}
      {showIncidentSuccessPopup && (
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
              {incidentSuccessMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowIncidentSuccessPopup(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident/Announcement Error Popup */}
      {showIncidentErrorPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
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
              {incidentErrorMessage || announcementErrorMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowIncidentErrorPopup(false);
                  setIncidentErrorMessage('');
                  setAnnouncementErrorMessage('');
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-xl border border-gray-200 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Resolve Incident</h2>
            <p className="text-gray-700 mb-4">
              Please enter resolution notes for this incident:
            </p>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
              rows="4"
              placeholder="Enter resolution notes..."
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setSelectedIncidentId(null);
                  setResolutionNotes('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResolveIncident}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Incident Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-xl border border-gray-200 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Incident</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this incident report? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setSelectedIncidentId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteIncident}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Announcement Confirmation Modal */}
      {showDeleteAnnouncementModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-xl border border-gray-200 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Announcement</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this announcement? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteAnnouncementModal(false);
                  setSelectedAnnouncementId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAnnouncement}
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

export default ToolsReports;
