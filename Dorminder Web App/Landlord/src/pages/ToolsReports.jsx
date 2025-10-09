import React, { useState, useEffect } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import AnnouncementForm from '../components/AnnouncementForm';
import IncidentReportForm from '../components/IncidentReportForm';
import { incidentService } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'incidents', label: 'Incident Reports', icon: '📋' }
  ];

  useEffect(() => {
    loadAnnouncements();
    if (activeTab === 'incidents') {
      loadIncidents();
    }
  }, [activeTab]);

  const loadAnnouncements = () => {
    try {
      const savedAnnouncements = localStorage.getItem('announcements');
      if (savedAnnouncements) {
        setAnnouncements(JSON.parse(savedAnnouncements));
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIncidents = async () => {
    try {
      setLoading(true);
      // In real implementation, get propertyId from user context
      const propertyId = user?.propertyId || 'default';
      const incidentsList = await incidentService.getIncidentsByProperty(propertyId);
      setIncidents(incidentsList);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnnouncement = (announcementData) => {
    try {
      let updatedAnnouncements;
      
      if (editingAnnouncement) {
        updatedAnnouncements = announcements.map(ann => 
          ann.id === editingAnnouncement.id 
            ? { ...ann, ...announcementData, updatedAt: new Date().toISOString() }
            : ann
        );
      } else {
        const newAnnouncement = {
          id: Date.now().toString(),
          ...announcementData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedAnnouncements = [newAnnouncement, ...announcements];
      }

      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
      setIsFormOpen(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleDeleteAnnouncement = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    }
  };

  const handleCreateIncident = async (incidentData) => {
    try {
      await incidentService.createIncident(incidentData);
      setIsIncidentFormOpen(false);
      loadIncidents();
      alert('Incident report created successfully!');
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  };

  const handleResolveIncident = async (incidentId) => {
    const resolutionNotes = prompt('Enter resolution notes:');
    if (resolutionNotes !== null) {
      try {
        await incidentService.resolveIncident(incidentId, resolutionNotes);
        loadIncidents();
        alert('Incident marked as resolved!');
      } catch (error) {
        console.error('Error resolving incident:', error);
        alert('Failed to resolve incident');
      }
    }
  };

  const handleDeleteIncident = async (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident report?')) {
      try {
        await incidentService.deleteIncident(incidentId);
        loadIncidents();
        alert('Incident report deleted successfully!');
      } catch (error) {
        console.error('Error deleting incident:', error);
        alert('Failed to delete incident');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-blue-100 text-blue-800';
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
                    {formatDate(announcement.date)}
                    {announcement.scheduleType === 'Scheduled' && announcement.scheduleFrom && (
                      <span className="ml-2">
                        • {formatDate(announcement.scheduleFrom)} to {formatDate(announcement.scheduleUntil)}
                      </span>
                    )}
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
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No Incidents Found' : 'No Incident Reports'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'No incidents have been reported yet'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setIsIncidentFormOpen(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Report First Incident
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredIncidents.map(incident => (
              <div key={incident.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{incident.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>👤 {incident.tenantName}</span>
                      <span>🏠 Room {incident.roomNumber}</span>
                      <span>📂 {incident.category}</span>
                      <span>📅 {formatDate(incident.createdAt?.toDate?.() || incident.createdAt)}</span>
                      {incident.estimatedCost && (
                        <span className="font-medium text-red-600">💰 ₱{parseFloat(incident.estimatedCost).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!incident.resolved && (
                      <button
                        onClick={() => handleResolveIncident(incident.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✓ Resolve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteIncident(incident.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{incident.description}</p>
                <div className="text-sm text-gray-500">
                  Reported by: {incident.reportedBy}
                  {incident.resolved && incident.resolutionNotes && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <strong className="text-green-900">Resolution:</strong>
                      <p className="text-green-800 mt-1">{incident.resolutionNotes}</p>
                    </div>
                  )}
                </div>
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
              propertyId={user?.propertyId || 'default'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsReports;
