import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyBvZrrUnDLL-gNhFpsVAhDUE3vJzuyd3Wk",
    authDomain: "dorminder-web-app-925c1.firebaseapp.com",
    projectId: "dorminder-web-app-925c1",
    storageBucket: "dorminder-web-app-925c1.firebasestorage.app",
    messagingSenderId: "556474579423",
    appId: "1:556474579423:web:34554fa010f5ecd635ec6a",
    measurementId: "G-8GYTKZ3KM2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
