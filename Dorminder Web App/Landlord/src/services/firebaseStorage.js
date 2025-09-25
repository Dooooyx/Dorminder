import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase app only if it doesn't exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * @param {string} path - Storage path (e.g., 'users/uid/profile/image.jpg')
 * @param {File} file - File object from input
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(path, file) {
  try {
    const storageRef = ref(storage, path);
    const result = await uploadBytes(storageRef, file);
    return await getDownloadURL(result.ref);
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Delete a file from Firebase Storage
 * @param {string} path - Storage path
 */
export async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Upload tenant valid ID image
 * @param {File} file - Image file
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<string>} Download URL
 */
export async function uploadTenantValidId(file, tenantId) {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `tenant-documents/${tenantId}/valid-id_${timestamp}.${extension}`;
  return await uploadFile(path, file);
}

/**
 * Upload profile image
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @returns {Promise<string>} Download URL
 */
export async function uploadProfileImage(file, userId) {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `users/${userId}/profile_${timestamp}.${extension}`;
  return await uploadFile(path, file);
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {Object} Validation result
 */
export function validateFile(file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'], maxSizeMB = 5) {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size too large. Maximum size: ${maxSizeMB}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
