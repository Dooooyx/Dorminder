// Firebase Storage Upload Service for React Native
import { uploadUri, uploadProfileImage, uploadValidIdImage, uploadRequestImage } from './firebaseStorage.js';

export class CloudinaryService {
  // Upload file to Firebase Storage
  async uploadFile(fileUri, folder = 'requests') {
    try {
      const timestamp = Date.now();
      const path = `${folder}/${timestamp}_image.jpg`;
      
      const downloadURL = await uploadUri(path, fileUri);
      
      return {
        success: true,
        downloadURL: downloadURL,
        url: downloadURL, // For compatibility
        path: path
      };

    } catch (error) {
      console.error('Firebase Storage upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload tenant valid ID image
  async uploadTenantValidId(fileUri, tenantId) {
    return await uploadValidIdImage(tenantId);
  }

  // Upload profile image
  async uploadProfileImage(fileUri, userId) {
    return await uploadProfileImage(userId);
  }

  // Upload request image
  async uploadRequestImage(fileUri, requestId) {
    return await uploadRequestImage(requestId);
  }

  // Get optimized image URL (Firebase Storage URLs are already optimized)
  getOptimizedUrl(downloadURL, options = {}) {
    // Firebase Storage URLs are already optimized, return as-is
    return downloadURL;
  }

  // Get thumbnail URL (same as optimized for Firebase Storage)
  getThumbnailUrl(downloadURL, size = 150) {
    // Firebase Storage URLs are already optimized, return as-is
    return downloadURL;
  }
}

export const cloudinaryService = new CloudinaryService();

