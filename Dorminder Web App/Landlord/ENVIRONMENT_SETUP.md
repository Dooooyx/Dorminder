# Environment Variables Setup Guide

## 🚀 **React.js (Landlord) App**

Create a file named `.env.local` in the `Landlord` directory with the following content:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBvZrrUnDLL-gNhFpsVAhDUE3vJzuyd3Wk
VITE_FIREBASE_AUTH_DOMAIN=dorminder-web-app-925c1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dorminder-web-app-925c1
VITE_FIREBASE_STORAGE_BUCKET=dorminder-web-app-925c1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=556474579423
VITE_FIREBASE_APP_ID=1:556474579423:web:34554fa010f5ecd635ec6a
VITE_FIREBASE_MEASUREMENT_ID=G-8GYTKZ3KM2

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dm3jdmi7t
VITE_CLOUDINARY_UPLOAD_PRESET=dorminder-upload
```

## 📱 **React Native (Tenant) App**

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

## 📝 **Important Notes**

1. **File Names**: 
   - React.js: `.env.local`
   - React Native: `.env`

2. **Variable Prefixes**:
   - React.js: `VITE_`
   - React Native: `EXPO_PUBLIC_`

3. **Security**: These files should be added to `.gitignore` to keep credentials secure.

4. **Restart Required**: After creating these files, restart your development servers.

## 🔧 **Commands to Create Files**

### For React.js (Landlord):
```bash
cd Landlord
touch .env.local
# Then copy the content above into the file
```

### For React Native (Dorminder):
```bash
cd Dorminder
touch .env
# Then copy the content above into the file
```

## ✅ **Verification**

After creating the files, restart your development servers:

```bash
# React.js
cd Landlord
npm run dev

# React Native
cd Dorminder
npx expo start
```

The Cloudinary integration should now work for image uploads in both applications!

