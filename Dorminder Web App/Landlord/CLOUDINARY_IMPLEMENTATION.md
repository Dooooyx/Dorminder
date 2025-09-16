# 🖼️ Cloudinary Implementation Guide

## 🚀 **Complete Setup for React.js + React Native**

### **Step 1: Cloudinary Account Setup**

1. **Sign up**: [Cloudinary.com](https://cloudinary.com)
2. **Get credentials** from dashboard:
   - Cloud Name dm3jdmi7t
   - API Key  492173427953812
   - API Secret L6U-TOnSG5WY7cmpFm5pP6qzoTM
3. **Create upload preset**:
   - Go to Settings → Upload
   - Create preset: `dorminder-upload`
   - Signing Mode: `Unsigned`
   - Folder: `dorminder`

### **Step 2: Environment Variables**

#### **React.js (Landlord) - `.env.local`:**
```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=dorminder-upload
VITE_CLOUDINARY_API_KEY=your-api-key
```

#### **React Native (Tenant) - `.env`:**
```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dorminder-upload
EXPO_PUBLIC_CLOUDINARY_API_KEY=your-api-key
```

### **Step 3: React.js Implementation**

#### **Updated `fileUploadService.js`:**
```javascript
// Cloudinary Upload Service for React.js
export class FileUploadService {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    this.baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  }

  // Upload file to Cloudinary
  async uploadFile(file, folder = 'dorminder') {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', folder);

      // Upload to Cloudinary
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        downloadURL: result.secure_url, // Same property for compatibility
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      };

    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload tenant valid ID image
  async uploadTenantValidId(file, tenantId) {
    const folder = `dorminder/tenant-documents/${tenantId}`;
    return await this.uploadFile(file, folder);
  }

  // Upload profile image
  async uploadProfileImage(file, userId) {
    const folder = `dorminder/profile-images/${userId}`;
    return await this.uploadFile(file, folder);
  }

  // Validate file
  validateFile(file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'], maxSizeMB = 5) {
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

  // Get optimized image URL
  getOptimizedUrl(publicId, options = {}) {
    const {
      width = 'auto',
      height = 'auto',
      quality = 'auto',
      format = 'auto'
    } = options;

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/w_${width},h_${height},q_${quality},f_${format}/${publicId}`;
  }

  // Get thumbnail URL
  getThumbnailUrl(publicId, size = 150) {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/w_${size},h_${size},c_fill,g_face/${publicId}`;
  }
}

export const fileUploadService = new FileUploadService();
```

### **Step 4: React Native Implementation**

#### **Install dependencies:**
```bash
cd Dorminder
npm install expo-image-picker expo-file-system
```

#### **Create `src/services/cloudinaryService.js`:**
```javascript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export class CloudinaryService {
  constructor() {
    this.cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    this.baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  }

  // Pick image from gallery or camera
  async pickImage() {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return { success: false, error: 'Permission denied' };
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  // Upload image to Cloudinary
  async uploadImage(imageUri, folder = 'dorminder') {
    try {
      // Create form data
      const formData = new FormData();
      
      // Add file
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);
      
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', folder);

      // Upload to Cloudinary
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      };

    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload profile image
  async uploadProfileImage(userId) {
    const pickResult = await this.pickImage();
    if (!pickResult.success) {
      return pickResult;
    }

    const folder = `dorminder/profile-images/${userId}`;
    return await this.uploadImage(pickResult.uri, folder);
  }

  // Upload valid ID image
  async uploadValidIdImage(tenantId) {
    const pickResult = await this.pickImage();
    if (!pickResult.success) {
      return pickResult;
    }

    const folder = `dorminder/tenant-documents/${tenantId}`;
    return await this.uploadImage(pickResult.uri, folder);
  }

  // Get optimized image URL
  getOptimizedUrl(publicId, options = {}) {
    const {
      width = 'auto',
      height = 'auto',
      quality = 'auto',
      format = 'auto'
    } = options;

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/w_${width},h_${height},q_${quality},f_${format}/${publicId}`;
  }
}

export const cloudinaryService = new CloudinaryService();
```

### **Step 5: Usage Examples**

#### **React.js (Landlord):**
```javascript
// In AddTenantModal.jsx
const handleFileUpload = async (file) => {
  const result = await fileUploadService.uploadTenantValidId(file, tenantId);
  if (result.success) {
    console.log('Image uploaded:', result.downloadURL);
  }
};
```

#### **React Native (Tenant):**
```javascript
// In ProfileScreen.jsx
const handleProfileImageUpload = async () => {
  const result = await cloudinaryService.uploadProfileImage(userId);
  if (result.success) {
    console.log('Image uploaded:', result.url);
  }
};
```

### **Step 6: Benefits**

- ✅ **25GB free storage** (vs Firebase's limited free tier)
- ✅ **25GB bandwidth/month** free
- ✅ **Automatic image optimization**
- ✅ **CDN delivery** (faster loading)
- ✅ **Image transformations** (thumbnails, resizing)
- ✅ **No CORS issues**
- ✅ **Works on both platforms**
- ✅ **Better performance**

## 🎯 **Next Steps:**

1. **Set up Cloudinary account**
2. **Add environment variables**
3. **Update the code files**
4. **Test image uploads**

## ✅ **Implementation Complete!**

The Cloudinary integration has been successfully implemented:

### **✅ Completed:**
1. **React.js Service**: `Landlord/src/services/fileUploadService.js` - Updated to use Cloudinary
2. **Tenant Service**: `Landlord/src/services/tenantService.js` - Updated to use Cloudinary uploads
3. **React Native Service**: `Dorminder/src/services/cloudinaryService.js` - Created
4. **Environment Setup**: `Landlord/ENVIRONMENT_SETUP.md` - Guide created

### **🚀 Next Steps:**
1. Create the environment files as described in `ENVIRONMENT_SETUP.md`
2. Restart your development servers
3. Test image uploads in both applications

The implementation is ready to use! 🎉
