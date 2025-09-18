# Firebase Setup Complete Guide for Dorminder

## 📋 Overview
This guide covers the complete Firebase setup required for the Dorminder application, including all services and configurations needed for both the tenant (React Native) and landlord (React.js) applications.

## 🔧 Prerequisites
- Firebase account
- Node.js installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Gmail account for email service

## 🚀 Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `dorminder-web-app-925c1` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### 1.2 Enable Required Services
Navigate to your project and enable these services:

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable **Email/Password**
3. Enable **Anonymous** (if needed)

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)

#### Storage
1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore

#### Functions
1. Go to Functions
2. Click "Get started"
3. Follow the setup wizard

## 🔑 Step 2: Get Configuration Keys

### 2.1 Web App Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" > Web app
4. Register app name: "Dorminder Web App"
5. Copy the configuration object

### 2.2 Android App Configuration (for React Native)
1. Click "Add app" > Android
2. Android package name: `com.dorminder.app` (or your package name)
3. Download `google-services.json`
4. Place it in `/Dorminder/` directory

## 📁 Step 3: File Structure Setup

```
Dorminder Web App/
├── Backend/
│   ├── functions/
│   │   ├── package.json ✅
│   │   └── src/
│   │       └── index.js ✅
│   ├── firestore/
│   │   ├── indexes.json
│   │   └── rules/
│   │       └── firestore.rules
│   └── firebase.json
├── Dorminder/
│   ├── google-services.json ✅ (Download from Firebase)
│   └── src/
│       └── services/
│           └── firebase.js ✅
└── Landlord/
    └── src/
        └── services/
            └── firebase.js ✅
```

## ⚙️ Step 4: Environment Variables

### 4.1 React Native (Dorminder) - .env file
Create `.env` in `/Dorminder/` directory:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4.2 React.js (Landlord) - .env file
Create `.env` in `/Landlord/` directory:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📧 Step 5: Email Service Configuration

### 5.1 Gmail App Password Setup
1. Go to your Google Account settings
2. Security > 2-Step Verification (enable if not already)
3. App passwords > Generate app password
4. Select "Mail" and "Other (custom name)"
5. Name: "Dorminder Email Service"
6. Copy the generated password

### 5.2 Configure Firebase Functions
Run these commands in the `/Backend/functions/` directory:

```bash
# Install dependencies
npm install

# Set Gmail credentials
firebase functions:config:set gmail.user="your-email@gmail.com" gmail.password="your-app-password"

# Deploy functions
firebase deploy --only functions
```

## 🗄️ Step 6: Firestore Database Rules

### 6.1 Security Rules
Update `firestore.rules` in `/Backend/firestore/rules/`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Landlords can read/write their own data
    match /landlords/{landlordId} {
      allow read, write: if request.auth != null && request.auth.uid == landlordId;
    }
    
    // Tenants can read/write their own data
    match /tenants/{tenantId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Requests - tenants can create, landlords can read/update
    match /requests/{requestId} {
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.tenantId;
      allow read, update: if request.auth != null && 
        (request.auth.uid == resource.data.tenantId || 
         request.auth.uid == resource.data.landlordId);
    }
    
    // Rooms - landlords can manage their rooms
    match /rooms/{roomId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.propertyId;
    }
    
    // Properties - landlords can manage their properties
    match /properties/{propertyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == propertyId;
    }
  }
}
```

### 6.2 Deploy Rules
```bash
firebase deploy --only firestore:rules
```

## 📊 Step 7: Firestore Indexes

### 7.1 Create Indexes
Update `indexes.json` in `/Backend/firestore/`:

```json
{
  "indexes": [
    {
      "collectionGroup": "requests",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "tenantId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "requests",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "landlordId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "tenants",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "propertyId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 7.2 Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

## 🚀 Step 8: Deploy Everything

### 8.1 Deploy All Services
```bash
# From the Backend directory
firebase deploy
```

### 8.2 Verify Deployment
1. Check Firebase Console for deployed functions
2. Test email functionality
3. Verify Firestore rules are active

## 🧪 Step 9: Testing Setup

### 9.1 Test Authentication
1. Try registering a landlord account
2. Try adding a tenant (should trigger email)
3. Test tenant login

### 9.2 Test Email Service
1. Add a tenant through landlord dashboard
2. Check tenant's email for credentials
3. Submit a request from tenant app
4. Check landlord's email for notification

### 9.3 Test Database
1. Verify data is being written to Firestore
2. Check security rules are working
3. Test real-time updates

## 🔧 Step 10: Production Considerations

### 10.1 Security
- Update Firestore rules for production
- Use environment variables for all secrets
- Enable App Check for additional security
- Set up proper CORS policies

### 10.2 Performance
- Monitor Firebase usage and costs
- Set up alerts for quota limits
- Optimize Firestore queries
- Consider caching strategies

### 10.3 Monitoring
- Enable Firebase Performance Monitoring
- Set up Crashlytics for error tracking
- Monitor function execution logs
- Set up uptime monitoring

## 📝 Step 11: Troubleshooting

### Common Issues:

#### Email Not Sending
- Check Gmail app password is correct
- Verify Firebase Functions are deployed
- Check function logs: `firebase functions:log`

#### Authentication Errors
- Verify API keys in environment variables
- Check Firebase project configuration
- Ensure proper package names

#### Database Permission Denied
- Check Firestore security rules
- Verify user authentication status
- Check field-level security

#### Functions Not Working
- Check function deployment status
- Verify dependencies are installed
- Check function logs for errors

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Review this guide step by step
3. Check Firebase documentation
4. Verify all environment variables are set correctly

## ✅ Final Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Functions deployed
- [ ] Environment variables set
- [ ] Gmail credentials configured
- [ ] Security rules deployed
- [ ] Indexes created
- [ ] Email service tested
- [ ] Authentication tested
- [ ] Database operations tested

---

**Note**: This setup guide covers all the features implemented in the Dorminder application, including the new email service, request functionality, and enhanced security measures.
