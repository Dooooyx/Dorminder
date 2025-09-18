import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Simplified authentication service for free tier (no Cloud Functions)
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

  // Register new user
  async register(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: userData.displayName || userData.firstName + ' ' + userData.lastName
      });

      // Send email verification
      try {
        await sendEmailVerification(user);
        console.log('Email verification sent successfully');
      } catch (emailError) {
        console.error('Email verification error:', emailError);
        // Continue with registration even if email fails
        // User can resend verification later
      }

      // Create user document in Firestore with role
      const userDocData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        firstName: userData.firstName || '',
        middleInitial: userData.middleInitial || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        role: userData.role || 'tenant',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // If landlord, also store property information
      if (userData.role === 'landlord' && userData.dormName && userData.dormAddress) {
        userDocData.propertyName = userData.dormName;
        userDocData.propertyAddress = userData.dormAddress;
      }

      await setDoc(doc(db, 'users', user.uid), userDocData);

      return { 
        success: true, 
        user, 
        needsVerification: true,
        message: 'Registration successful! Please check your email to verify your account.'
      };
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

      // Check if email is verified
      if (!user.emailVerified) {
        // Sign out the user if email is not verified
        await signOut(auth);
        return { 
          success: false, 
          error: 'Please verify your email before signing in. Check your inbox for the verification email.',
          needsVerification: true 
        };
      }

      // Get user role from Firestore document (free tier approach)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'tenant';

      return { success: true, user, role };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Sign in failed. ';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage += 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage += 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage += 'Incorrect password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage += 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage += 'This account has been disabled.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      return { success: false, error: errorMessage };
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
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Get user role from Firestore document
      const role = userDoc.exists() ? userDoc.data().role : 'tenant';

      return { success: true, user, role };
    } catch (error) {
      console.error('Google sign in error:', error);
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

  // Check if user is landlord
  isLandlord() {
    return this.userRole === 'landlord';
  }

  // Check if user is tenant
  isTenant() {
    return this.userRole === 'tenant';
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

  // Check if user needs email verification
  needsEmailVerification() {
    return this.currentUser && !this.currentUser.emailVerified;
  }

  // Force sign in without email verification (for testing)
  async forceSignIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore document
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'tenant';

      return { success: true, user, role, emailVerified: user.emailVerified };
    } catch (error) {
      console.error('Force sign in error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Initialize auth service
authService.init();

export default authService;