import { authService } from './auth';
import { firestoreService } from './firestore';

export class PropertyService {
  // Get landlord's property information from user profile
  async getLandlordPropertyInfo() {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'User not logged in' };
      }

      const userProfile = await authService.getUserProfile(currentUser.uid);
      if (userProfile.success) {
        const { propertyName, propertyAddress } = userProfile.data;
        return {
          success: true,
          data: {
            propertyName: propertyName || '',
            propertyAddress: propertyAddress || ''
          }
        };
      }

      return { success: false, error: 'Failed to get user profile' };
    } catch (error) {
      console.error('Error getting landlord property info:', error);
      return { success: false, error: error.message };
    }
  }

  // Update landlord's property information
  async updateLandlordPropertyInfo(propertyName, propertyAddress) {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'User not logged in' };
      }

      const result = await authService.updateUserProfile(currentUser.uid, {
        propertyName,
        propertyAddress
      });

      return result;
    } catch (error) {
      console.error('Error updating landlord property info:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
export const propertyService = new PropertyService();

export default propertyService;
