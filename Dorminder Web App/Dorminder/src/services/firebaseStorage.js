import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app only if it doesn't exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const storage = getStorage(app);

/**
 * Upload a file from URI to Firebase Storage
 * @param {string} path - Storage path
 * @param {string} uri - Local file URI
 * @returns {Promise<string>} Download URL
 */
export async function uploadUri(path, uri) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    const result = await uploadBytes(storageRef, blob);
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
 * Pick image from gallery or camera
 * @returns {Promise<Object>} Result with success and uri
 */
export async function pickImage() {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return { success: false, error: 'Permission denied' };
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return { success: true, uri: result.assets[0].uri };
    }

    return { success: false, error: 'No image selected' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Pick and upload profile image
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Result with success and url
 */
export async function uploadProfileImage(userId) {
  try {
    const pickResult = await pickImage();
    if (!pickResult.success) {
      return pickResult;
    }

    const timestamp = Date.now();
    const path = `users/${userId}/profile_${timestamp}.jpg`;
    const downloadUrl = await uploadUri(path, pickResult.uri);
    
    return { success: true, url: downloadUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Pick and upload valid ID image
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object>} Result with success and url
 */
export async function uploadValidIdImage(tenantId) {
  try {
    const pickResult = await pickImage();
    if (!pickResult.success) {
      return pickResult;
    }

    const timestamp = Date.now();
    const path = `tenant-documents/${tenantId}/valid-id_${timestamp}.jpg`;
    const downloadUrl = await uploadUri(path, pickResult.uri);
    
    return { success: true, url: downloadUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Pick and upload request image
 * @param {string} requestId - Request ID
 * @returns {Promise<Object>} Result with success and url
 */
export async function uploadRequestImage(requestId) {
  try {
    const pickResult = await pickImage();
    if (!pickResult.success) {
      return pickResult;
    }

    const timestamp = Date.now();
    const path = `requests/${requestId}/image_${timestamp}.jpg`;
    const downloadUrl = await uploadUri(path, pickResult.uri);
    
    return { success: true, url: downloadUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
