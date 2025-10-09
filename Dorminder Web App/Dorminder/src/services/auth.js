import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';


// Role-based authentication service for React Native
export class AuthService {
  constructor() {
    this.currentUser = null;
    this.userRole = null;
    this.listeners = [];
  }

  // Add auth state listener
  addAuthStateListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of auth state change
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser, this.userRole));
  }

  // Initialize auth state listener
  init() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUser = user;
        // Get user role from Firestore document (free tier approach)
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role || 'tenant';
        } else {
          this.userRole = 'tenant'; // Default role
        }
      } else {
        this.currentUser = null;
        this.userRole = null;
      }
      this.notifyListeners();
    });
  }


  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore document (free tier approach)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'tenant';

      return { success: true, user, role };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }


  // Set user role (Free tier approach - update Firestore document)
  async setUserRole(uid, role) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        role,
        updatedAt: new Date()
      });
      
      // Update local role if it's the current user
      if (this.currentUser && this.currentUser.uid === uid) {
        this.userRole = role;
        this.notifyListeners();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Set user role error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateUserProfile(uid, userData) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...userData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user profile
  async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    // Return from Firebase auth if available, fallback to cached value
    return auth.currentUser || this.currentUser;
  }

  // Get current user role
  getCurrentUserRole() {
    return this.userRole;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.userRole === role;
  }

  // Check if user is tenant
  isTenant() {
    return this.userRole === 'tenant';
  }

  // Check if user is landlord
  isLandlord() {
    return this.userRole === 'landlord';
  }

  // Check if email is verified
  isEmailVerified() {
    return this.currentUser && this.currentUser.emailVerified;
  }

  // Resend email verification
  async resendEmailVerification() {
    try {
      if (this.currentUser) {
        await sendEmailVerification(this.currentUser);
        console.log('Resend email verification sent successfully');
        return { success: true, message: 'Verification email sent!' };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Resend verification error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send verification email. ';
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage += 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage += 'Invalid email address.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage += 'User not found.';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      return { success: false, error: errorMessage };
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Initialize auth service
authService.init();

export default authService;
