// Cloudinary Upload Service for React Native
export class CloudinaryService {
  constructor() {
    this.cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dm3jdmi7t';
    this.uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dorminder-upload';
    this.baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  }

  // Upload file to Cloudinary
  async uploadFile(fileUri, folder = 'dorminder') {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'image.jpg'
      });
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
        downloadURL: result.secure_url,
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
  async uploadTenantValidId(fileUri, tenantId) {
    const folder = `dorminder/tenant-documents/${tenantId}`;
    return await this.uploadFile(fileUri, folder);
  }

  // Upload profile image
  async uploadProfileImage(fileUri, userId) {
    const folder = `dorminder/profile-images/${userId}`;
    return await this.uploadFile(fileUri, folder);
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

export const cloudinaryService = new CloudinaryService();

