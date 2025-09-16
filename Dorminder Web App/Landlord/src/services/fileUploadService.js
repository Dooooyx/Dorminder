// Cloudinary Upload Service for React.js
export class FileUploadService {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dm3jdmi7t';
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'dorminder-upload';
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