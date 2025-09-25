// Firebase Storage Upload Service for React.js
import { uploadFile, uploadTenantValidId, uploadProfileImage, validateFile } from './firebaseStorage.js';

export class FileUploadService {
  // Upload file to Firebase Storage
  async uploadFile(file, folder = 'dorminder') {
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      const path = `${folder}/${timestamp}_${file.name}`;
      
      const downloadURL = await uploadFile(path, file);
      
      return {
        success: true,
        downloadURL: downloadURL,
        path: path
      };

    } catch (error) {
      console.error('Firebase Storage upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload tenant valid ID image
  async uploadTenantValidId(file, tenantId) {
    return await uploadTenantValidId(file, tenantId);
  }

  // Upload profile image
  async uploadProfileImage(file, userId) {
    return await uploadProfileImage(file, userId);
  }

  // Validate file
  validateFile(file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'], maxSizeMB = 5) {
    return validateFile(file, allowedTypes, maxSizeMB);
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

export const fileUploadService = new FileUploadService();