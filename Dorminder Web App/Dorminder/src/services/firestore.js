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

// Firestore service for React Native app (Tenant side)
export class FirestoreService {
  
  // ===== TENANT OPERATIONS =====

  // Get tenant profile
  async getTenantProfile(userId) {
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
      return { success: false, error: 'Tenant profile not found' };
    } catch (error) {
      console.error('Error getting tenant profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update tenant profile
  async updateTenantProfile(tenantId, updateData) {
    try {
      await updateDoc(doc(db, 'tenants', tenantId), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating tenant profile:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== REQUESTS =====

  // Create maintenance request
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

  // Get tenant's requests
  async getTenantRequests(tenantId) {
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

  // Update request (tenant can only update their own)
  async updateRequest(requestId, updateData) {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating request:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== ANNOUNCEMENTS =====

  // Get announcements for tenant's property
  async getAnnouncements(propertyId) {
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

  // ===== PROPERTY INFO =====

  // Get property information
  async getPropertyInfo(propertyId) {
    try {
      const docRef = doc(db, 'properties', propertyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: false, error: 'Property not found' };
    } catch (error) {
      console.error('Error getting property info:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== REAL-TIME LISTENERS =====

  // Listen to tenant's requests in real-time
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

  // ===== PAYMENTS =====

  // Get tenant's payment history
  async getPaymentHistory(tenantId) {
    try {
      const q = query(
        collection(db, 'payments'),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const payments = [];
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: payments };
    } catch (error) {
      console.error('Error getting payment history:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== NOTIFICATIONS =====

  // Get tenant's notifications
  async getNotifications(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: notifications };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return { success: false, error: error.message };
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
        readAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
export const firestoreService = new FirestoreService();

export default firestoreService;
