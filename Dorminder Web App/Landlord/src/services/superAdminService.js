import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { db } from './firebase';

// Super Admin Service for managing landlords
export class SuperAdminService {
  
  // Get all landlords from users collection
  async getAllLandlords() {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'landlord'));
      const querySnapshot = await getDocs(q);
      
      const landlords = [];
      querySnapshot.forEach((docSnapshot) => {
        landlords.push({
          id: docSnapshot.id,
          ...docSnapshot.data()
        });
      });
      
      return { success: true, landlords };
    } catch (error) {
      console.error('Error fetching landlords:', error);
      return { success: false, error: error.message };
    }
  }

  // Enable a landlord (set enabled to true)
  async enableLandlord(landlordId) {
    try {
      const landlordRef = doc(db, 'users', landlordId);
      await updateDoc(landlordRef, {
        enabled: true,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error enabling landlord:', error);
      return { success: false, error: error.message };
    }
  }

  // Disable a landlord (set enabled to false)
  async disableLandlord(landlordId) {
    try {
      const landlordRef = doc(db, 'users', landlordId);
      await updateDoc(landlordRef, {
        enabled: false,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error disabling landlord:', error);
      return { success: false, error: error.message };
    }
  }

  // Toggle landlord enabled status
  async toggleLandlordStatus(landlordId, currentStatus) {
    if (currentStatus) {
      return await this.disableLandlord(landlordId);
    } else {
      return await this.enableLandlord(landlordId);
    }
  }
}

// Create singleton instance
export const superAdminService = new SuperAdminService();

export default superAdminService;

