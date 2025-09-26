import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export class RequestService {
  
  // Create new request
  async createRequest(requestData) {
    try {
      const request = {
        tenantId: requestData.tenantId,
        propertyId: requestData.propertyId,
        title: requestData.title,
        description: requestData.description,
        category: requestData.category || 'general',
        priority: requestData.priority || 'medium', // low, medium, high, urgent
        status: 'pending', // pending, ongoing, completed, cancelled
        images: requestData.images || [],
        landlordNotes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'requests'), request);
      return { success: true, requestId: docRef.id };
    } catch (error) {
      console.error('Error creating request:', error);
      return { success: false, error: error.message };
    }
  }

  // Get requests by tenant
  async getRequestsByTenant(tenantId) {
    try {
      const q = query(
        collection(db, 'requests'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: requests };
    } catch (error) {
      console.error('Error getting requests by tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Get requests by property (for landlords)
  async getRequestsByProperty(propertyId) {
    try {
      const q = query(
        collection(db, 'requests'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: requests };
    } catch (error) {
      console.error('Error getting requests by property:', error);
      return { success: false, error: error.message };
    }
  }

  // Get requests by status (optionally filter by category)
  async getRequestsByStatus(propertyId, status, category) {
    try {
      console.log('🔍 getRequestsByStatus called with:', { propertyId, status, category });
      
      const constraints = [
        where('propertyId', '==', propertyId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      ];
      if (category) {
        constraints.splice(2, 0, where('category', '==', category));
        console.log('✅ Added category filter:', category);
      }
      
      const q = query(collection(db, 'requests'), ...constraints);
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('📄 Found request:', { id: doc.id, category: data.category, status: data.status });
        requests.push({ id: doc.id, ...data });
      });
      
      console.log(`📊 Total requests found: ${requests.length} for category: ${category}`);
      return { success: true, data: requests };
    } catch (error) {
      console.error('Error getting requests by status:', error);
      return { success: false, error: error.message };
    }
  }

  // Update request status
  async updateRequestStatus(requestId, status, landlordNotes = '') {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status,
        landlordNotes,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating request status:', error);
      return { success: false, error: error.message };
    }
  }

  // Complete request
  async completeRequest(requestId, landlordNotes = '') {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'completed',
        landlordNotes,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error completing request:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel request
  async cancelRequest(requestId, reason = '') {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error cancelling request:', error);
      return { success: false, error: error.message };
    }
  }

  // Get request details
  async getRequest(requestId) {
    try {
      const requestRef = doc(db, 'requests', requestId);
      const requestSnap = await getDoc(requestRef);
      
      if (requestSnap.exists()) {
        return { success: true, data: { id: requestSnap.id, ...requestSnap.data() } };
      } else {
        return { success: false, error: 'Request not found' };
      }
    } catch (error) {
      console.error('Error getting request:', error);
      return { success: false, error: error.message };
    }
  }

  // Add landlord notes to request
  async addLandlordNotes(requestId, notes) {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        landlordNotes: notes,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding landlord notes:', error);
      return { success: false, error: error.message };
    }
  }

  // Get request statistics for property
  async getRequestStats(propertyId) {
    try {
      const allRequests = await this.getRequestsByProperty(propertyId);
      if (!allRequests.success) {
        return { success: false, error: allRequests.error };
      }

      const requests = allRequests.data;
      const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        ongoing: requests.filter(r => r.status === 'ongoing').length,
        completed: requests.filter(r => r.status === 'completed').length,
        cancelled: requests.filter(r => r.status === 'cancelled').length
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting request stats:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete request
  async deleteRequest(requestId) {
    try {
      await deleteDoc(doc(db, 'requests', requestId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting request:', error);
      return { success: false, error: error.message };
    }
  }
}

export const requestService = new RequestService();




