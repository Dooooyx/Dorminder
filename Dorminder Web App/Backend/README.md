# Dorminder Backend - Firebase Cloud Functions

This directory contains the Firebase Cloud Functions backend for the Dorminder application.

## Project Structure

```
backend/
├── functions/                    # Firebase Cloud Functions
│   ├── src/                     # Function source code
│   │   ├── auth.js             # Authentication functions
│   │   ├── properties.js       # Property management functions
│   │   ├── tenants.js          # Tenant management functions
│   │   ├── requests.js         # Request management functions
│   │   └── notifications.js    # Notification functions
│   ├── package.json            # Dependencies
│   └── index.js               # Main entry point
├── firestore/                  # Firestore configuration
│   ├── rules/                 # Security rules
│   │   └── firestore.rules    # Firestore security rules
│   └── indexes.json           # Database indexes
└── README.md                  # This file
```

## Setup Instructions

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase Project

```bash
cd "/Users/danallenpantinople/Dorminder Web App"
firebase init
```

Select the following options:
- ✅ **Functions** (for Cloud Functions)
- ✅ **Firestore** (for database rules)
- ✅ **Hosting** (optional, for web hosting)

### 4. Install Dependencies

```bash
cd backend/functions
npm install
```

### 5. Set up Environment Variables

Create a `.env` file in the functions directory:

```bash
# Firebase project configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Optional: External service configurations
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

### 6. Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:createProperty
```

### 7. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## Available Functions

### Authentication Functions
- `createUserProfile` - Creates user profile on signup
- `updateUserRole` - Updates user role (tenant/landlord)
- `deleteUserProfile` - Deletes user profile on account deletion

### Property Functions
- `createProperty` - Creates a new property
- `updateProperty` - Updates property details
- `deleteProperty` - Soft deletes a property
- `getPropertiesByLandlord` - Gets all properties for a landlord

### Tenant Functions
- `createTenant` - Adds a tenant to a property
- `updateTenant` - Updates tenant information
- `deleteTenant` - Removes tenant from property
- `getTenantsByProperty` - Gets all tenants for a property

### Request Functions
- `createRequest` - Creates a maintenance request
- `updateRequest` - Updates request status/details
- `deleteRequest` - Deletes a request
- `getRequestsByProperty` - Gets all requests for a property (landlord view)
- `getRequestsByTenant` - Gets all requests for a tenant

### Notification Functions
- `sendNotification` - Sends notification to a user
- `sendBulkNotification` - Sends notification to multiple users

## Database Schema

### Collections

1. **users** - User profiles and authentication data
2. **properties** - Property information
3. **tenants** - Tenant information and lease details
4. **requests** - Maintenance and other requests
5. **announcements** - Property announcements
6. **notifications** - User notifications

### Security Rules

The Firestore security rules ensure:
- Users can only access their own data
- Landlords can only manage their own properties
- Tenants can only access their assigned properties
- Proper role-based access control

## Development

### Local Development

```bash
# Start Firebase emulators
firebase emulators:start

# Start only functions emulator
firebase emulators:start --only functions
```

### Testing Functions

```bash
# Test functions locally
firebase functions:shell

# View logs
firebase functions:log
```

## Deployment

### Production Deployment

```bash
# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only rules
firebase deploy --only firestore:rules
```

### Environment Management

```bash
# Set environment variables
firebase functions:config:set someservice.key="THE API KEY"

# Get current config
firebase functions:config:get
```

## Monitoring

- **Firebase Console**: Monitor function executions and logs
- **Cloud Logging**: Detailed logs and debugging
- **Cloud Monitoring**: Performance metrics and alerts

## Security

- All functions require authentication
- Role-based access control
- Input validation and sanitization
- Firestore security rules
- HTTPS only endpoints

## Cost Optimization

- Functions are triggered only when needed
- Firestore queries are optimized with indexes
- Soft deletes to maintain data integrity
- Efficient data structures and queries

