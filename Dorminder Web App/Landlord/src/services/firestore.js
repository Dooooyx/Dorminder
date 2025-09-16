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
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Firestore service for connecting web and mobile apps
export class FirestoreService {
  
  // ===== PROPERTIES =====
  
  // Create property
  async createProperty(propertyData) {
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...propertyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating property:', error);
      return { success: false, error: error.message };
    }
  }

  // Get properties by landlord
  async getPropertiesByLandlord(landlordId) {
    try {
      const q = query(
        collection(db, 'properties'),
        where('landlordId', '==', landlordId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const properties = [];
      querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: properties };
    } catch (error) {
      console.error('Error getting properties:', error);
      return { success: false, error: error.message };
    }
  }

  // Update property
  async updateProperty(propertyId, updateData) {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating property:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete property
  async deleteProperty(propertyId) {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting property:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== TENANTS =====

  // Create tenant
  async createTenant(tenantData) {
    try {
      const docRef = await addDoc(collection(db, 'tenants'), {
        ...tenantData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tenants by property
  async getTenantsByProperty(propertyId) {
    try {
      const q = query(
        collection(db, 'tenants'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const tenants = [];
      querySnapshot.forEach((doc) => {
        tenants.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: tenants };
    } catch (error) {
      console.error('Error getting tenants:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tenant by user ID
  async getTenantByUserId(userId) {
    try {
      const q = query(
        collection(db, 'tenants'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { success: true, data: { id: doc.id, ...doc.data() } };
      }
      return { success: false, error: 'Tenant not found' };
    } catch (error) {
      console.error('Error getting tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Update tenant
  async updateTenant(tenantId, updateData) {
    try {
      await updateDoc(doc(db, 'tenants', tenantId), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete tenant
  async deleteTenant(tenantId) {
    try {
      await deleteDoc(doc(db, 'tenants', tenantId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== REQUESTS =====

  // Create request
  async createRequest(requestData) {
    try {
      const docRef = await addDoc(collection(db, 'requests'), {
        ...requestData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating request:', error);
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
      console.error('Error getting requests:', error);
      return { success: false, error: error.message };
    }
  }

  // Get requests by tenant (for tenants)
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
      console.error('Error getting requests:', error);
      return { success: false, error: error.message };
    }
  }

  // Update request status
  async updateRequestStatus(requestId, status, landlordNotes = '') {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status,
        landlordNotes,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating request:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== ANNOUNCEMENTS =====

  // Create announcement
  async createAnnouncement(announcementData) {
    try {
      const docRef = await addDoc(collection(db, 'announcements'), {
        ...announcementData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating announcement:', error);
      return { success: false, error: error.message };
    }
  }

  // Get announcements by property
  async getAnnouncementsByProperty(propertyId) {
    try {
      const q = query(
        collection(db, 'announcements'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const announcements = [];
      querySnapshot.forEach((doc) => {
        announcements.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: announcements };
    } catch (error) {
      console.error('Error getting announcements:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== REAL-TIME LISTENERS =====

  // Listen to requests in real-time (for landlords)
  listenToRequests(propertyId, callback) {
    const q = query(
      collection(db, 'requests'),
      where('propertyId', '==', propertyId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      callback(requests);
    });
  }

  // Listen to announcements in real-time
  listenToAnnouncements(propertyId, callback) {
    const q = query(
      collection(db, 'announcements'),
      where('propertyId', '==', propertyId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const announcements = [];
      querySnapshot.forEach((doc) => {
        announcements.push({ id: doc.id, ...doc.data() });
      });
      callback(announcements);
    });
  }

  // Listen to tenant requests in real-time (for tenants)
  listenToTenantRequests(tenantId, callback) {
    const q = query(
      collection(db, 'requests'),
      where('tenantId', '==', tenantId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      callback(requests);
    });
  }
}

// Create singleton instance
export const firestoreService = new FirestoreService();

export default firestoreService;
