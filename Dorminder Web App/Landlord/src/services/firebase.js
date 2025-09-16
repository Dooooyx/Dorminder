import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBvZrrUnDLL-gNhFpsVAhDUE3vJzuyd3Wk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dorminder-web-app-925c1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dorminder-web-app-925c1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dorminder-web-app-925c1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "556474579423",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:556474579423:web:34554fa010f5ecd635ec6a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8GYTKZ3KM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
