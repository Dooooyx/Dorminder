import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { authService } from './auth';
import { tenantDataService } from './tenantDataService';

export const requestService = {
  // Submit a new request
  async submitRequest(requestData) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get tenant data to include in request
      const tenantResult = await tenantDataService.getTenantData(currentUser.uid);
      if (!tenantResult.success) {
        throw new Error('Tenant data not found');
      }

      const tenantData = tenantResult.data;

      // Prepare request data
      const request = {
        title: requestData.title,
        description: requestData.description,
        imageUrl: requestData.imageUrl || null,
        status: 'pending',
        priority: requestData.priority || 'medium',
        tenantId: currentUser.uid,
        tenantName: `${tenantData.firstName} ${tenantData.lastName}`,
        tenantEmail: tenantData.email,
        propertyId: tenantData.propertyId,
        propertyName: tenantData.propertyName || 'Unknown Property',
        landlordId: tenantData.landlordId || tenantData.propertyId,
        landlordEmail: tenantData.landlordEmail || 'landlord@example.com',
        landlordName: tenantData.landlordName || 'Property Owner',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add request to Firestore
      const docRef = await addDoc(collection(db, 'requests'), request);
      
      console.log('✅ Request submitted successfully to Firestore:', docRef.id);

      return { 
        success: true, 
        requestId: docRef.id,
        message: 'Request submitted successfully' 
      };
    } catch (error) {
      console.error('Error submitting request:', error);
      throw error;
    }
  },

  // Get requests for a specific tenant
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
        requests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, requests };
    } catch (error) {
      console.error('Error fetching tenant requests:', error);
      throw error;
    }
  },

  // Get requests for a specific landlord
  async getLandlordRequests(landlordId) {
    try {
      const q = query(
        collection(db, 'requests'),
        where('landlordId', '==', landlordId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, requests };
    } catch (error) {
      console.error('Error fetching landlord requests:', error);
      throw error;
    }
  },

  // Update request status
  async updateRequestStatus(requestId, status, notes = '') {
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: status,
        notes: notes,
        updatedAt: serverTimestamp()
      });
      
      return { success: true, message: 'Request status updated successfully' };
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }
};
