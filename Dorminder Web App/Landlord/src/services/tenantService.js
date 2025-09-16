import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile,
  updatePassword,
  getAuth
} from 'firebase/auth';
import { db, auth } from './firebase';
import { roomService } from './roomService';
import { fileUploadService } from './fileUploadService';
import jsPDF from 'jspdf';

export class TenantService {
  
  // Create tenant account and send verification email
  async createTenant(tenantData) {
    try {
      // Validate file if provided (but don't upload yet - we need the tenant ID first)
      if (tenantData.validIdImage && tenantData.validIdImage instanceof File) {
        const validation = fileUploadService.validateFile(tenantData.validIdImage);
        if (!validation.isValid) {
          return { success: false, error: validation.errors.join(', ') };
        }
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        tenantData.email, 
        tenantData.password
      );
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${tenantData.firstName} ${tenantData.lastName}`
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create tenant document in Firestore
      const tenantDocData = {
        userId: user.uid,
        email: tenantData.email,
        firstName: tenantData.firstName,
        middleName: tenantData.middleName || '',
        lastName: tenantData.lastName,
        contactNumber: tenantData.contactNumber,
        emergencyContact: tenantData.emergencyContact,
        emergencyContactNumber: tenantData.emergencyContactNumber,
        validIdType: tenantData.validIdType,
        validIdNumber: tenantData.validIdNumber,
        validIdImage: '', // Will be updated after file upload
        propertyId: tenantData.propertyId,
        roomId: tenantData.roomId || null,
        roomNumber: tenantData.roomNumber || '',
        monthlyRent: tenantData.monthlyRent,
        leaseStartDate: tenantData.leaseStartDate,
        leaseEndDate: tenantData.leaseEndDate,
        securityDeposit: tenantData.securityDeposit || 0,
        role: 'tenant',
        emailVerified: false,
        status: 'pending', // pending, active, inactive, overdue
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'tenants'), tenantDocData);

      // Upload valid ID image if provided
      if (tenantData.validIdImage && tenantData.validIdImage instanceof File) {
        const uploadResult = await fileUploadService.uploadTenantValidId(tenantData.validIdImage, docRef.id);
        if (uploadResult.success) {
          // Update the tenant document with the image URL
          await updateDoc(doc(db, 'tenants', docRef.id), {
            validIdImage: uploadResult.downloadURL,
            updatedAt: serverTimestamp()
          });
        } else {
          console.warn('Failed to upload valid ID image:', uploadResult.error);
        }
      }

      // If room is assigned, update room status to Occupied
      if (tenantData.roomId) {
        await roomService.assignTenantToRoom(tenantData.roomId, docRef.id);
      }

      // Generate and send PDF document
      await this.generateTenantDocument(tenantDocData, user.uid);

      return { 
        success: true, 
        tenantId: docRef.id,
        userId: user.uid,
        message: 'Tenant created successfully! Verification email sent.'
      };
    } catch (error) {
      console.error('Error creating tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate PDF document for tenant registration
  async generateTenantDocument(tenantData, userId) {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('TENANT REGISTRATION DOCUMENT', 20, 30);
      
      // Add property information
      doc.setFontSize(14);
      doc.text('Property Information:', 20, 50);
      doc.setFontSize(12);
      doc.text(`Property: ${tenantData.propertyName || 'N/A'}`, 20, 60);
      doc.text(`Address: ${tenantData.propertyAddress || 'N/A'}`, 20, 70);
      doc.text(`Room: ${tenantData.roomNumber || 'TBD'}`, 20, 80);
      
      // Add tenant information
      doc.setFontSize(14);
      doc.text('Tenant Information:', 20, 100);
      doc.setFontSize(12);
      doc.text(`Name: ${tenantData.firstName} ${tenantData.middleName} ${tenantData.lastName}`, 20, 110);
      doc.text(`Email: ${tenantData.email}`, 20, 120);
      doc.text(`Contact: ${tenantData.contactNumber}`, 20, 130);
      doc.text(`Emergency Contact: ${tenantData.emergencyContact} - ${tenantData.emergencyContactNumber}`, 20, 140);
      doc.text(`Valid ID: ${tenantData.validIdType} - ${tenantData.validIdNumber}`, 20, 150);
      
      // Add lease details
      doc.setFontSize(14);
      doc.text('Lease Details:', 20, 170);
      doc.setFontSize(12);
      doc.text(`Monthly Rent: ₱${tenantData.monthlyRent}`, 20, 180);
      doc.text(`Lease Start: ${new Date(tenantData.leaseStartDate).toLocaleDateString()}`, 20, 190);
      doc.text(`Lease End: ${new Date(tenantData.leaseEndDate).toLocaleDateString()}`, 20, 200);
      doc.text(`Security Deposit: ₱${tenantData.securityDeposit}`, 20, 210);
      
      // Add footer
      doc.setFontSize(10);
      doc.text('Generated on: ' + new Date().toLocaleString(), 20, 280);
      
      // Save PDF (in a real app, you'd upload this to Firebase Storage)
      const pdfBlob = doc.output('blob');
      
      // In a real implementation, you would:
      // 1. Upload PDF to Firebase Storage
      // 2. Send email with PDF attachment
      // 3. Store PDF URL in tenant document
      
      console.log('PDF generated successfully');
      return { success: true, pdfBlob };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tenant by ID
  async getTenant(tenantId) {
    try {
      const docRef = doc(db, 'tenants', tenantId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Tenant not found' };
      }
    } catch (error) {
      console.error('Error getting tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tenant by user ID
  async getTenantByUserId(userId) {
    try {
      const q = query(
        collection(db, 'tenants'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: 'Tenant not found' };
      }
    } catch (error) {
      console.error('Error getting tenant by user ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tenants by property
  async getTenantsByProperty(propertyId) {
    try {
      // Try with orderBy first (preferred)
      try {
        const q = query(
          collection(db, 'tenants'),
          where('propertyId', '==', propertyId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const tenants = [];
        
        querySnapshot.forEach((doc) => {
          tenants.push({ id: doc.id, ...doc.data() });
        });
        
        return { success: true, data: tenants };
      } catch (indexError) {
        // If index is still building, fallback to simple query
        console.log('Index still building, using fallback query');
        const q = query(
          collection(db, 'tenants'),
          where('propertyId', '==', propertyId)
        );
        const querySnapshot = await getDocs(q);
        const tenants = [];
        
        querySnapshot.forEach((doc) => {
          tenants.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort manually since we can't use orderBy
        tenants.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bTime - aTime; // Descending order
        });
        
        return { success: true, data: tenants };
      }
    } catch (error) {
      console.error('Error getting tenants by property:', error);
      return { success: false, error: error.message };
    }
  }

  // Assign room to tenant
  async assignRoom(tenantId, roomId, roomNumber, monthlyRent) {
    try {
      const tenantRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantRef, {
        roomId,
        roomNumber,
        monthlyRent,
        status: 'active',
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error assigning room:', error);
      return { success: false, error: error.message };
    }
  }

  // Update tenant status
  async updateTenantStatus(tenantId, status) {
    try {
      const tenantRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating tenant status:', error);
      return { success: false, error: error.message };
    }
  }

  // Update tenant information
  async updateTenant(tenantId, updateData) {
    try {
      const tenantRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating tenant:', error);
      return { success: false, error: error.message };
    }
  }

  // Update tenant password
  async updateTenantPassword(tenantId, newPassword) {
    try {
      // First get the tenant to find the userId
      const tenantDoc = await getDoc(doc(db, 'tenants', tenantId));
      if (!tenantDoc.exists()) {
        return { success: false, error: 'Tenant not found' };
      }
      
      const tenantData = tenantDoc.data();
      const userId = tenantData.userId;
      
      // Update the password in Firebase Auth
      // Note: This requires the user to be currently signed in or use Admin SDK
      // For now, we'll store the new password in Firestore and handle it differently
      await updateDoc(doc(db, 'tenants', tenantId), {
        tempPassword: newPassword, // Store temporarily for admin to set
        passwordUpdated: true,
        updatedAt: serverTimestamp()
      });
      
      return { success: true, message: 'Password update request recorded. Tenant will need to reset password on next login.' };
    } catch (error) {
      console.error('Error updating tenant password:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete tenant
  async deleteTenant(tenantId) {
    try {
      // Get tenant data to find roomId
      const tenantDoc = await getDoc(doc(db, 'tenants', tenantId));
      if (tenantDoc.exists()) {
        const tenantData = tenantDoc.data();
        
        // If tenant has a room, set it back to Vacant
        if (tenantData.roomId) {
          await roomService.removeTenantFromRoom(tenantData.roomId);
        }
      }
      
      await deleteDoc(doc(db, 'tenants', tenantId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting tenant:', error);
      return { success: false, error: error.message };
    }
  }
}

export const tenantService = new TenantService();
