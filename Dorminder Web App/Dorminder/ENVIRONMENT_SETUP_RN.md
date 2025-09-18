# React Native Environment Setup

## 📱 **Create Environment File**

Create a file named `.env` in the `Dorminder` directory with the following content:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBvZrrUnDLL-gNhFpsVAhDUE3vJzuyd3Wk
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=dorminder-web-app-925c1.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=dorminder-web-app-925c1
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=dorminder-web-app-925c1.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=556474579423
EXPO_PUBLIC_FIREBASE_APP_ID=1:556474579423:web:34554fa010f5ecd635ec6a
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8GYTKZ3KM2

# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dm3jdmi7t
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dorminder-upload
```

## 🔧 **Commands to Create the File**

```bash
cd Dorminder
touch .env
# Then copy the content above into the file
```

## ✅ **Verification**

After creating the file, restart your React Native development server:

```bash
cd Dorminder
npx expo start
```

The authentication should now work with Firebase!

