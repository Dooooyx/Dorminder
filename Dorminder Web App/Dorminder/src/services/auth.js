import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from './firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

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
        // Get user role from custom claims
        const idTokenResult = await user.getIdTokenResult();
        this.userRole = idTokenResult.claims.role || 'tenant';
      } else {
        this.currentUser = null;
        this.userRole = null;
      }
      this.notifyListeners();
    });
  }

  // Register new tenant
  async register(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: userData.displayName || userData.firstName + ' ' + userData.lastName
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        role: 'tenant', // Default role for mobile app
        propertyId: userData.propertyId || null,
        roomNumber: userData.roomNumber || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Set custom claims
      await this.setUserRole(user.uid, 'tenant');

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from custom claims
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role || 'tenant';

      return { success: true, user, role };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          phone: user.phoneNumber || '',
          role: 'tenant', // Default role for mobile app
          propertyId: null,
          roomNumber: '',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Get user role from custom claims
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role || 'tenant';

      return { success: true, user, role };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Set user role (Admin function)
  async setUserRole(uid, role) {
    try {
      const setUserRole = httpsCallable(functions, 'setUserRole');
      await setUserRole({ uid, role });
      
      // Force token refresh to get updated claims
      await auth.currentUser?.getIdToken(true);
      
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
    return this.currentUser;
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
}

// Create singleton instance
export const authService = new AuthService();

// Initialize auth service
authService.init();

export default authService;
