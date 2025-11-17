import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

const incidentService = {
  // Create a new incident report
  async createIncident(incidentData) {
    try {
      const docRef = await addDoc(collection(db, 'incidents'), {
        ...incidentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        resolved: false,
        status: 'open'
      });
      
      console.log('Incident created with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  },

  // Get all incidents for a specific property
  async getIncidentsByProperty(propertyId) {
    try {
      const q = query(
        collection(db, 'incidents'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const incidents = [];
      
      querySnapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return incidents;
    } catch (error) {
      console.error('Error getting incidents:', error);
      throw error;
    }
  },

  // Get all incidents (for admin purposes)
  async getAllIncidents() {
    try {
      const q = query(
        collection(db, 'incidents'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const incidents = [];
      
      querySnapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return incidents;
    } catch (error) {
      console.error('Error getting all incidents:', error);
      throw error;
    }
  },

  // Update an incident
  async updateIncident(incidentId, updateData) {
    try {
      const incidentRef = doc(db, 'incidents', incidentId);
      await updateDoc(incidentRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      console.log('Incident updated successfully');
    } catch (error) {
      console.error('Error updating incident:', error);
      throw error;
    }
  },

  // Resolve an incident
  async resolveIncident(incidentId, resolutionNotes) {
    try {
      const incidentRef = doc(db, 'incidents', incidentId);
      await updateDoc(incidentRef, {
        resolved: true,
        status: 'resolved',
        resolutionNotes: resolutionNotes,
        resolvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Incident resolved successfully');
    } catch (error) {
      console.error('Error resolving incident:', error);
      throw error;
    }
  },

  // Reopen a resolved incident
  async reopenIncident(incidentId) {
    try {
      const incidentRef = doc(db, 'incidents', incidentId);
      await updateDoc(incidentRef, {
        resolved: false,
        status: 'open',
        resolvedAt: null,
        updatedAt: serverTimestamp()
      });
      
      console.log('Incident reopened successfully');
    } catch (error) {
      console.error('Error reopening incident:', error);
      throw error;
    }
  },

  // Delete an incident
  async deleteIncident(incidentId) {
    try {
      await deleteDoc(doc(db, 'incidents', incidentId));
      console.log('Incident deleted successfully');
    } catch (error) {
      console.error('Error deleting incident:', error);
      throw error;
    }
  },

  // Get incidents by status
  async getIncidentsByStatus(propertyId, status) {
    try {
      const q = query(
        collection(db, 'incidents'),
        where('propertyId', '==', propertyId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const incidents = [];
      
      querySnapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return incidents;
    } catch (error) {
      console.error('Error getting incidents by status:', error);
      throw error;
    }
  },

  // Get incidents by severity
  async getIncidentsBySeverity(propertyId, severity) {
    try {
      const q = query(
        collection(db, 'incidents'),
        where('propertyId', '==', propertyId),
        where('severity', '==', severity),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const incidents = [];
      
      querySnapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return incidents;
    } catch (error) {
      console.error('Error getting incidents by severity:', error);
      throw error;
    }
  },

  // Get incidents by category
  async getIncidentsByCategory(propertyId, category) {
    try {
      const q = query(
        collection(db, 'incidents'),
        where('propertyId', '==', propertyId),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const incidents = [];
      
      querySnapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return incidents;
    } catch (error) {
      console.error('Error getting incidents by category:', error);
      throw error;
    }
  },

  // Get incident statistics for a property
  async getIncidentStats(propertyId) {
    try {
      const incidents = await this.getIncidentsByProperty(propertyId);
      
      const stats = {
        total: incidents.length,
        open: incidents.filter(inc => !inc.resolved).length,
        resolved: incidents.filter(inc => inc.resolved).length,
        bySeverity: {
          low: incidents.filter(inc => inc.severity === 'low').length,
          medium: incidents.filter(inc => inc.severity === 'medium').length,
          high: incidents.filter(inc => inc.severity === 'high').length,
          critical: incidents.filter(inc => inc.severity === 'critical').length
        },
        byCategory: {},
        byStatus: {
          open: incidents.filter(inc => inc.status === 'open').length,
          in_progress: incidents.filter(inc => inc.status === 'in_progress').length,
          resolved: incidents.filter(inc => inc.status === 'resolved').length,
          closed: incidents.filter(inc => inc.status === 'closed').length
        }
      };

      // Count by category
      incidents.forEach(incident => {
        const category = incident.category || 'Unknown';
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting incident stats:', error);
      throw error;
    }
  }
};

export { incidentService };




