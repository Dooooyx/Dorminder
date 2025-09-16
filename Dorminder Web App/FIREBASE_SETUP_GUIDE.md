# Firebase Authentication Setup Guide

## Overview
This guide sets up Firebase authentication with role-based access control for both the Landlord (ReactJS) and Tenant (React Native) applications.

## Architecture
- **Landlord Portal**: ReactJS web app for property management
- **Tenant App**: React Native mobile app for tenants
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Role Management**: Custom claims for role-based access

## 1. Firebase Project Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "Dorminder"
4. **For Free Tier**: Disable Google Analytics to save on usage
5. Create project

### Firebase Free Tier (Spark Plan) Limitations
- **Authentication**: 10,000 verifications/month
- **Firestore**: 1GB storage, 50K reads, 20K writes, 20K deletes/day
- **Cloud Functions**: ❌ **NOT INCLUDED** - Requires Blaze plan (pay-as-you-go)
- **Storage**: 1GB storage, 10GB/month downloads
- **Hosting**: 10GB storage, 10GB/month transfer

### Enable Authentication ✅
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable:
   - Email/Password (free)
   - Google (free for both web and mobile)
   - **Avoid**: Phone authentication (costs money)

### Free Tier Authentication Tips
- **Email/Password**: Unlimited for free tier
- **Google Sign-In**: Free but counts toward verification limit
- **Anonymous Auth**: Available but not recommended for this app
- **Custom Claims**: Free but use sparingly

### Enable Firestore Database ✅
1. Go to "Firestore Database"
2. Click "Create database"
3. Start in test mode (we'll add security rules later)
4. Choose a location close to your users

### Free Tier Firestore Optimization
- **Use indexes efficiently**: Only create necessary composite indexes
- **Batch operations**: Group multiple writes/reads together
- **Pagination**: Implement pagination to reduce reads
- **Data structure**: Keep documents small and efficient
- **Offline caching**: Use Firestore offline persistence

### Cloud Functions - Not Available in Free Tier
**⚠️ IMPORTANT**: Cloud Functions require the Blaze plan (pay-as-you-go). We'll use client-side logic instead.

### Free Tier Approach
- **Client-side role management**: Roles stored in Firestore documents
- **Firestore security rules**: For access control
- **No server-side functions**: All logic handled client-side

## 2. Environment Configuration

### Landlord App (ReactJS)
Create `.env.local` in `/Landlord/` directory:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Tenant App (React Native)
Create `.env` in `/Dorminder/` directory:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 3. Free Tier Setup (No Cloud Functions)

### Skip Cloud Functions
Since Cloud Functions require the Blaze plan, we'll use client-side logic only.

## 4. Deploy Firestore Rules ✅

### Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

## 5. Role Management

### User Roles
- **tenant**: Default role for mobile app users
- **landlord**: Role for web portal users

### Role Assignment
- Roles are set during user registration
- Stored in Firestore user documents
- Enforced by Firestore security rules

## 6. Security Rules ✅

The Firestore security rules enforce:
- Users can only access their own data
- Landlords can only access their properties and tenants
- Tenants can only access their own data and property info
- Admins have full access

## 7. Testing Authentication ✅

### Test Landlord Login
1. Start the ReactJS app: `cd Landlord && npm run dev`
2. Go to `/register` and create a landlord account
3. Login should redirect to `/dashboard`

### Test Tenant Login
1. Start the React Native app: `cd Dorminder && npm start`
2. Test registration and login flows

## 8. User Flow

### Landlord Registration
1. User visits web portal
2. Clicks "Register"
3. Fills out form with property details
4. Account created with 'landlord' role
5. Redirected to dashboard

### Tenant Registration
1. User downloads mobile app
2. Clicks "Register"
3. Fills out form
4. Account created with 'tenant' role
5. Redirected to tenant dashboard

## 9. Database Structure

### Users Collection
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "John Doe",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  role: "landlord" | "tenant",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Properties Collection
```javascript
{
  propertyId: "property_id",
  landlordId: "landlord_uid",
  name: "Property Name",
  address: "Property Address",
  description: "Property Description",
  totalRooms: 10,
  occupiedRooms: 5,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Tenants Collection
```javascript
{
  tenantId: "tenant_id",
  userId: "user_uid",
  propertyId: "property_id",
  roomNumber: "101",
  leaseStart: timestamp,
  leaseEnd: timestamp,
  monthlyRent: 5000,
  status: "active" | "inactive",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Requests Collection
```javascript
{
  requestId: "request_id",
  tenantId: "tenant_id",
  propertyId: "property_id",
  title: "Request Title",
  description: "Request Description",
  category: "maintenance" | "complaint" | "other",
  status: "pending" | "in_progress" | "completed" | "rejected",
  priority: "low" | "medium" | "high",
  landlordNotes: "Landlord response",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Announcements Collection
```javascript
{
  announcementId: "announcement_id",
  propertyId: "property_id",
  landlordId: "landlord_uid",
  title: "Announcement Title",
  message: "Announcement Content",
  isImportant: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 10. Connecting Web and Mobile Apps with Firestore

### Real-Time Data Synchronization
Firestore enables real-time synchronization between your web and mobile apps:

- **Landlord Web App**: Manages properties, tenants, and requests
- **Tenant Mobile App**: Views announcements, submits requests, checks status
- **Shared Database**: Both apps read/write to the same Firestore collections
- **Real-Time Updates**: Changes appear instantly across both platforms

### How It Works
1. **Landlord creates property** → Stored in Firestore
2. **Tenant registers** → Linked to property via `propertyId`
3. **Tenant submits request** → Landlord sees it in real-time
4. **Landlord updates request** → Tenant sees status change instantly
5. **Landlord posts announcement** → All tenants in property see it

### Key Features
- **Real-time listeners**: `onSnapshot()` for live updates
- **Offline support**: Works without internet connection
- **Automatic sync**: Data syncs when connection restored
- **Security rules**: Role-based access control
- **Free tier friendly**: No Cloud Functions needed

### Example Usage
```javascript
// Landlord creates announcement
await firestoreService.createAnnouncement({
  propertyId: 'property_123',
  landlordId: 'landlord_uid',
  title: 'Water Maintenance',
  message: 'Water will be shut off tomorrow 9-11 AM',
  isImportant: true
});

// Tenant sees announcement in real-time
firestoreService.listenToAnnouncements(propertyId, (announcements) => {
  setAnnouncements(announcements);
});
```

## 11. Free Tier Billing & Monitoring

### Setting Up Billing Alerts
1. Go to Firebase Console → Project Settings → Usage and billing
2. Click "Set up billing alerts"
3. Set alerts at 50%, 80%, and 95% of limits
4. Add email notifications for your team

### Daily Monitoring Checklist
- [ ] Check Firestore usage (reads/writes/deletes)
- [ ] Check authentication verifications
- [ ] Review storage usage
- [ ] Check for any unexpected spikes

### Free Tier Dashboard
Monitor usage in Firebase Console → Usage and billing

## 11. Troubleshooting

### Common Issues
1. **CORS errors**: Check Firebase project settings
2. **Permission denied**: Verify Firestore rules
3. **Role not updating**: Check Cloud Functions deployment
4. **Environment variables**: Ensure correct variable names
5. **Quota exceeded**: Check usage limits in console

### Debug Steps
1. Check Firebase Console for errors
2. Check browser console for client errors
3. Check Cloud Functions logs
4. Verify environment variables
5. Check usage quotas and limits

## 12. Free Tier Production Considerations

### Cost Management
- **Monitor usage daily**: Check Firebase Console usage tab
- **Set up billing alerts**: Get notified when approaching limits
- **Optimize data structure**: Minimize document size and reads
- **Use caching**: Implement client-side caching
- **Batch operations**: Combine multiple operations

### Performance Optimization
- **Implement pagination**: Load data in chunks (10-20 items)
- **Use Firestore offline**: Enable offline persistence
- **Optimize queries**: Use specific field selections
- **Minimize real-time listeners**: Use onSnapshot sparingly
- **Cache user data**: Store frequently accessed data locally

### Free Tier Monitoring
- **Daily usage checks**: Monitor Firestore reads/writes
- **Function invocation tracking**: Keep under 125K/month
- **Storage monitoring**: Stay under 1GB
- **Authentication limits**: Track verification counts
- **Set up alerts**: Configure billing alerts at 80% usage

### Scaling Strategies
- **Start with free tier**: Perfect for MVP and testing
- **Monitor growth**: Track user and data growth
- **Plan upgrade**: Consider Blaze plan when approaching limits
- **Optimize before upgrading**: Maximize free tier usage first

## 13. Free Tier Usage Estimates

### Typical Usage for Small Dormitory (50-100 tenants)
- **Authentication**: ~500-1000 verifications/month
- **Firestore Reads**: ~15K-30K reads/month
- **Firestore Writes**: ~5K-10K writes/month
- **Storage**: ~100-500MB

### Usage Optimization Tips
- **Batch tenant updates**: Update multiple tenants in one operation
- **Cache property data**: Store property info locally
- **Use pagination**: Load rooms/tenants in pages of 10-20
- **Minimize real-time updates**: Only use for critical data
- **Optimize images**: Compress images before upload

### When to Upgrade to Blaze Plan
- **Approaching 80% of limits**: Upgrade before hitting limits
- **Need more storage**: When approaching 1GB
- **More users**: When exceeding 100 active users
- **Advanced features**: Need for phone auth, advanced analytics

## 14. Next Steps

1. **Complete the setup** by adding your Firebase configuration
2. **Test both applications** thoroughly
3. **Monitor usage** from day one
4. **Optimize before scaling** to maximize free tier
5. **Plan upgrade path** when approaching limits

## Support

For issues or questions:
1. Check Firebase documentation
2. Review error logs
3. Test in development environment
4. Contact development team
