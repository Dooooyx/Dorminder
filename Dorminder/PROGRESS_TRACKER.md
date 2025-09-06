# Dorminder App - Comprehensive Development Roadmap
**Target Deadline: October 8-14, 2024 (2nd week of October)**

## 🎯 Project Overview
Dorminder is a React Native mobile application with Expo framework, designed to be a comprehensive dormitory management system for tenants and landlords.

## 📊 Current Status: **FRONT-END FOUNDATION COMPLETE (75%)**
- ✅ Basic project structure and navigation
- ✅ Login/Register screens with polished UI
- ✅ TenantDashboard with beautiful card components
- ✅ TopNav and BotNav components
- ✅ Responsive design and styling
- ✅ **BurgerNav component with blur effect**
- ✅ **Interactive burger menu integration**
- ✅ **Menu items fully pressable and functional**
- ✅ **Expo-blur package integrated for modern UI**
- ✅ **TenantRules screen with complete navigation**
- ✅ **Smart header switching logic (TopNav/TenantInfoHeader)**
- ✅ **All BotNav tabs functional with proper navigation**

---

## 🔄 APP FLOW & ARCHITECTURE (AI-PROMPT FRIENDLY)

### **Current App Structure**
```
Dorminder App
├── App.js (Main entry point)
├── src/
│   ├── components/
│   │   ├── TopNav.js (Header with logo, notifications, profile, burger menu)
│   │   ├── BotNav.js (Bottom navigation tabs)
│   │   ├── BurgerNav.js (Slide-out menu with blur effect)
│   │   ├── InfoCard.js (Reusable card for rent/payment info)
│   │   ├── AnnouncementCard.js (Announcement display component)
│   │   ├── InputField.js (Form input component)
│   │   ├── CustomButton.js (Styled button component)
│   │   └── TermsConsent.js (Terms and conditions component)
│   ├── screens/
│   │   ├── LoginScreen.js (User authentication)
│   │   ├── RegisternScreen.js (User registration)
│   │   └── TenantDashboard.js (Main dashboard with all functionality)
│   ├── assets/
│   │   ├── icons/ (PNG icons for UI)
│   │   ├── images/ (App images)
│   │   └── logo/ (App branding)
│   └── styles/ (Global styling)
```

### **User Journey Flow**
```
1. App Launch → LoginScreen
2. Login/Register → TenantDashboard
3. Dashboard Navigation:
   ├── Dashboard Tab (Default view)
   ├── Rules Tab (Dormitory rules)
   ├── Request Tab (Maintenance requests)
   └── Payment Tab (Rent payments)
4. Burger Menu (TopNav) → Slide-out menu with:
   ├── View Room Details
   ├── Contact Info
   ├── Notifications Settings
   ├── Change Password
   └── Log Out
```

### **Component Integration Map**
```
TenantDashboard.js (Main Container)
├── TopNav (Header)
│   ├── Logo
│   ├── Notification Bell
│   ├── Profile Avatar
│   └── Burger Menu → BurgerNav
├── Content Area (Tab-based)
│   ├── Dashboard View (InfoCard + AnnouncementCard)
│   ├── Rules View (Placeholder)
│   ├── Request View (Placeholder)
│   └── Payment View (Placeholder)
└── BotNav (Bottom Navigation)
    ├── Dashboard Icon
    ├── Rules Icon
    ├── Request Icon
    └── Payment Icon
```

### **State Management Flow**
```javascript
// Current State Structure
TenantDashboard State:
├── activeTab: 'dashboard' | 'rules' | 'request' | 'payment'
├── isBurgerNavVisible: boolean
└── userName: string

// Event Handlers
├── handleTabPress(tabId) → Updates activeTab
├── handleMenuPress() → Opens BurgerNav
├── handleCloseBurgerNav() → Closes BurgerNav
└── Menu Item Handlers → Close BurgerNav + Execute Action
```

### **Styling Architecture**
```javascript
// Design System
Colors:
├── Primary: #EE6C4D (Orange accent)
├── Secondary: #4A90E2 (Blue)
├── Text: #1f2937 (Dark gray)
├── Background: #f5f5f5 (Light gray)
└── Border: #E5E7EB (Light border)

Components:
├── Cards: White background, rounded corners, shadow
├── Buttons: Rounded, with hover states
├── Navigation: Clean, minimal design
└── Typography: System fonts with weight variations
```

---

## 🚀 DEVELOPMENT PHASES

### **PHASE 1: FRONT-END COMPLETION (Current Phase - 2 weeks)**

#### **Week 1: UI Components & Screens**
- [x] **Project Setup & Navigation**
  - [x] React Native + Expo initialization
  - [x] Navigation stack setup
  - [x] Basic folder structure
- [x] **Core UI Components**
  - [x] InputField, CustomButton, TermsConsent
  - [x] TopNav with logo integration and burger menu
  - [x] BotNav with tab switching
  - [x] InfoCard and AnnouncementCard components
  - [x] **BurgerNav with blur overlay effect**
  - [x] **Interactive menu system with proper touch handling**
- [x] **Authentication Screens**
  - [x] LoginScreen with polished UI
  - [x] RegisterScreen (basic structure)
  - [x] Navigation flow between screens

#### **Week 2: Complete Screen Set & Polish**
- [ ] **Tenant Screens**
  - [x] RulesScreen (detailed dormitory rules) ✅ **COMPLETED**
  - [x] Navigation System (BotNav with all tabs) ✅ **COMPLETED**
  - [x] Header Logic (TopNav/TenantInfoHeader switching) ✅ **COMPLETED**
  - [ ] RequestScreen (maintenance request form)
  - [ ] PaymentScreen (rent payment interface)
  - [ ] ProfileScreen (user profile management)
- [ ] **Landlord Screens** (if applicable)
  - [ ] LandlordDashboard
  - [ ] TenantManagement
  - [ ] AnnouncementManagement
- [ ] **UI Polish & Consistency**
  - [ ] Replace emoji icons with PNG icons
  - [ ] Add loading states and animations
  - [ ] Implement dark mode toggle
  - [ ] Add error handling and success feedback
  - [ ] Responsive design for different screen sizes

#### **Week 3: State Management & Data Flow**
- [ ] **Context API Setup**
  - [ ] UserContext (authentication state)
  - [ ] DashboardContext (active tabs, data)
  - [ ] ThemeContext (dark/light mode)
- [ ] **Mock Data Integration**
  - [ ] Tenant information mock data
  - [ ] Rent/payment history mock data
  - [ ] Announcements mock data
  - [ ] Rules and policies mock data

---

### **PHASE 2: BACK-END INTEGRATION WITH FIREBASE (3 weeks)**

#### **Week 4: Firebase Setup & Authentication**
- [ ] **Firebase Project Configuration**
  - [ ] Create Firebase project
  - [ ] Enable Authentication (Email/Password, Google)
  - [ ] Enable Firestore Database
  - [ ] Enable Storage for images
  - [ ] Configure security rules
- [ ] **Authentication Implementation**
  - [ ] Connect login to Firebase Auth
  - [ ] Implement user registration
  - [ ] Add password reset functionality
  - [ ] Google OAuth integration
  - [ ] User session management

#### **Week 5: Database Structure & CRUD Operations**
- [ ] **Firestore Collections Design**
  ```javascript
  // Database Structure
  users: {
    userId: {
      email, name, role, roomNumber, contractEnd, profileImage
    }
  }
  
  payments: {
    paymentId: {
      userId, amount, date, status, type
    }
  }
  
  announcements: {
    announcementId: {
      title, body, date, author, priority, status
    }
  }
  
  maintenance_requests: {
    requestId: {
      userId, title, description, date, status, priority
    }
  }
  ```
- [ ] **CRUD Operations Implementation**
  - [ ] User profile CRUD
  - [ ] Payment history CRUD
  - [ ] Announcements CRUD
  - [ ] Maintenance requests CRUD

#### **Week 6: Real-time Features & Advanced Functions**
- [ ] **Real-time Updates**
  - [ ] Live announcement notifications
  - [ ] Real-time payment status updates
  - [ ] Live maintenance request tracking
- [ ] **Advanced Features**
  - [ ] Push notifications setup
  - [ ] Image upload for requests
  - [ ] Payment gateway integration (Stripe/PayPal)
  - [ ] File upload for documents

---

### **PHASE 3: PRODUCTION READINESS (2 weeks)**

#### **Week 7: Testing & Quality Assurance**
- [ ] **Testing Implementation**
  - [ ] Unit tests for components
  - [ ] Integration tests for screens
  - [ ] User acceptance testing
  - [ ] Performance optimization
- [ ] **Bug Fixes & Polish**
  - [ ] Fix all reported issues
  - [ ] Performance optimization
  - [ ] Accessibility improvements
  - [ ] Cross-platform testing

#### **Week 8: Deployment & Launch**
- [ ] **Production Build**
  - [ ] App store assets (icons, screenshots)
  - [ ] Production environment configuration
  - [ ] Final testing on physical devices
- [ ] **Launch Preparation**
  - [ ] App store submission
  - [ ] Marketing materials
  - [ ] User documentation
  - [ ] Support system setup

---

## 🛠️ TECHNICAL IMPLEMENTATION DETAILS

### **Front-end Architecture**
```javascript
// Component Structure
src/
├── components/
│   ├── common/           // Reusable UI components
│   ├── forms/            // Form-specific components
│   └── navigation/       // Navigation components
├── screens/
│   ├── auth/            // Authentication screens
│   ├── tenant/          // Tenant-specific screens
│   └── landlord/        // Landlord-specific screens
├── contexts/             // React Context providers
├── hooks/                // Custom React hooks
├── utils/                // Helper functions
└── assets/               // Images, icons, fonts
```

### **State Management Strategy**
```javascript
// Context Structure
UserContext: {
  user: null,
  isAuthenticated: false,
  login: (email, password) => {},
  logout: () => {},
  updateProfile: (data) => {}
}

DashboardContext: {
  activeTab: 'dashboard',
  refreshData: () => {},
  notifications: []
}

ThemeContext: {
  isDarkMode: false,
  toggleTheme: () => {},
  colors: {...}
}
```

### **Firebase Integration Points**
```javascript
// Key Firebase Services
Authentication: Email/Password, Google OAuth
Firestore: Real-time database for all app data
Storage: Profile images, document uploads
Functions: Serverless backend logic
Analytics: User behavior tracking
```

---

## 📋 IMMEDIATE NEXT STEPS (AI-PROMPT FRIENDLY)

### **Priority 1: Complete Tenant Screens**
**AI Prompt**: "Create the remaining tenant screens for the Dorminder app. We need RulesScreen, RequestScreen, PaymentScreen, and ProfileScreen. Follow the existing design patterns from TenantDashboard.js. Each screen should integrate with the existing tab navigation system and maintain the same styling architecture."

1. **RulesScreen**: 
   - Display dormitory rules and policies
   - Use ScrollView for long content
   - Include categories (Quiet Hours, Guest Policy, etc.)
   - Follow InfoCard styling pattern

2. **RequestScreen**: 
   - Maintenance request form
   - Use InputField and CustomButton components
   - Include request categories, description, priority
   - Form validation and submission handling

3. **PaymentScreen**: 
   - Rent payment interface
   - Display payment history using InfoCard pattern
   - Payment method selection
   - Due dates and amounts

4. **ProfileScreen**: 
   - User profile management
   - Edit personal information
   - Change password functionality
   - Profile picture upload

### **Priority 2: Icon Replacement & Visual Polish**
**AI Prompt**: "Replace all emoji icons in the Dorminder app with professional PNG icons. Update TopNav.js, BotNav.js, and any other components using emojis. Ensure icons are consistent in size (24x24px) and style. Use the existing icon structure in src/assets/icons/."

1. **Icon Updates Needed**:
   - Notification bell (🔔) → ic_notification.png
   - User profile (👤) → ic_profile.png  
   - Dashboard tab (🏠) → ic_dashboard.png
   - Rules tab (⚖️) → ic_rules.png
   - Request tab (📝) → ic_request.png
   - Payment tab (💳) → ic_payment.png

2. **Visual Enhancements**:
   - Add loading states to buttons
   - Implement success/error feedback
   - Add subtle animations
   - Improve responsive design

### **Priority 3: State Management & Data Flow**
**AI Prompt**: "Implement Context API for the Dorminder app. Create UserContext, DashboardContext, and ThemeContext. Integrate them with the existing TenantDashboard component. Add mock data for announcements, payments, and user information. Follow the existing state management patterns."

1. **Context API Setup**:
   ```javascript
   // UserContext: Authentication, user data
   // DashboardContext: Active tabs, notifications, data refresh
   // ThemeContext: Dark/light mode, color schemes
   ```

2. **Mock Data Integration**:
   - User profile information
   - Payment history
   - Announcements list
   - Maintenance requests
   - Dormitory rules

### **Priority 4: Enhanced Functionality**
**AI Prompt**: "Add advanced features to the Dorminder app. Implement form validation, error handling, loading states, and success feedback. Add pull-to-refresh functionality to the dashboard. Create reusable modal components for confirmations and forms."

1. **Form Validation**: Input validation for all forms
2. **Error Handling**: Network errors, validation errors
3. **Loading States**: Spinners, skeleton screens
4. **Success Feedback**: Toast notifications, success messages
5. **Pull-to-Refresh**: Dashboard data refresh
6. **Modal Components**: Confirmation dialogs, form modals

---

## 🤖 AI DEVELOPMENT ASSISTANCE GUIDE

### **Current Codebase Context for AI**
```javascript
// Key Files and Their Purposes
App.js: Main entry point, basic navigation setup
src/screens/TenantDashboard.js: Main dashboard with tab navigation and burger menu
src/components/TopNav.js: Header with logo, notifications, profile, burger menu
src/components/BotNav.js: Bottom tab navigation
src/components/BurgerNav.js: Slide-out menu with blur effect
src/components/InfoCard.js: Reusable card for displaying information
src/components/AnnouncementCard.js: Announcement display component
```

### **Development Patterns to Follow**
```javascript
// Component Structure Pattern
const ComponentName = ({ prop1, prop2, onAction }) => {
  const [state, setState] = useState(initialValue);
  
  const handleAction = () => {
    // Action logic
    onAction && onAction();
  };
  
  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};

// Styling Pattern
const styles = StyleSheet.create({
  container: {
    // Consistent styling
  },
});
```

### **Integration Points for New Features**
```javascript
// Adding New Screens to TenantDashboard
1. Add new tab to activeTab state
2. Create new screen component
3. Add conditional rendering in content area
4. Update BotNav with new tab icon
5. Add handler function for tab switching

// Adding New Menu Items to BurgerNav
1. Add new handler function in TenantDashboard
2. Pass handler as prop to BurgerNav
3. Add MenuItem component in BurgerNav
4. Ensure handler closes menu after action
```

### **Styling Guidelines**
```javascript
// Color Palette (Use consistently)
Primary Orange: #EE6C4D
Secondary Blue: #4A90E2
Text Dark: #1f2937
Text Light: #6b7280
Background: #f5f5f5
Border: #E5E7EB
White: #ffffff

// Spacing System
Padding: 20px (main), 16px (cards), 12px (small)
Margin: 20px (sections), 16px (components), 8px (small)
Border Radius: 10px (cards), 8px (buttons), 4px (inputs)

// Typography
Headers: 28px, 700 weight
Subheaders: 22px, 700 weight
Body: 16px, 400 weight
Small: 14px, 400 weight
```

### **Package Dependencies**
```json
// Current Dependencies
"expo": "~50.0.0"
"expo-blur": "~12.9.0"
"react": "18.2.0"
"react-native": "0.73.0"

// Common Patterns
- Use TouchableOpacity for buttons
- Use ScrollView for long content
- Use Animated for smooth transitions
- Use BlurView for modern overlays
```

---

## 🎯 SUCCESS METRICS

### **Front-end Phase (Week 1-3)**
- [ ] All screens implemented and styled
- [ ] Smooth navigation between screens
- [ ] Consistent UI/UX across all components
- [ ] Responsive design working on all screen sizes

### **Back-end Phase (Week 4-6)**
- [ ] Firebase authentication working
- [ ] Real-time data synchronization
- [ ] CRUD operations functional
- [ ] Push notifications working

### **Production Phase (Week 7-8)**
- [ ] App passes all tests
- [ ] Performance optimized
- [ ] Ready for app store submission
- [ ] User documentation complete

---

## 🚨 RISK MITIGATION

### **Technical Risks**
- **Firebase Configuration**: Start with simple setup, add complexity gradually
- **State Management**: Use Context API initially, migrate to Redux if needed
- **Performance**: Implement lazy loading and image optimization early

### **Timeline Risks**
- **Scope Creep**: Stick to MVP features, add extras post-launch
- **Testing Delays**: Start testing early, parallel with development
- **Platform Issues**: Test on both iOS and Android throughout development

---

## 📚 RESOURCES & REFERENCES

### **Firebase Documentation**
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Authentication Methods](https://firebase.google.com/docs/auth)

### **React Native Resources**
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

---

**Last Updated**: December 2024 - Navigation System & TenantRules Complete
**Next Review**: After completing remaining tenant screens (RequestScreen, PaymentScreen, ProfileScreen)
**Project Manager**: Development Team
**Status**: 🟢 IN PROGRESS - Front-end Foundation Phase (75% Complete)

## 🎉 RECENT ACCOMPLISHMENTS (December 2024)
- ✅ **BurgerNav Component**: Fully functional slide-out menu with blur effect
- ✅ **Interactive Menu System**: All menu items are pressable and functional
- ✅ **Expo-blur Integration**: Modern blur overlay instead of dark background
- ✅ **Touch Event Handling**: Fixed overlay interference with menu interactions
- ✅ **State Management**: Proper burger menu visibility control
- ✅ **Component Integration**: Seamless integration with TenantDashboard
- ✅ **AI-Friendly Documentation**: Comprehensive progress tracker for future development
- ✅ **Figma-Accurate Screens**: Complete rebuild of TenantDashboard and TenantRules screens
- ✅ **Reusable Components**: TenantInfoHeader and BottomNavigation components
- ✅ **Pixel-Perfect Design**: Exact color matching and typography from Figma designs
- ✅ **TenantRules Screen**: Complete implementation with detailed boarding house rules
- ✅ **Navigation System**: Fixed BotNav navigation between all tabs and screens
- ✅ **Header Logic**: Smart TopNav/TenantInfoHeader switching based on active tab
- ✅ **Component Cleanup**: Removed duplicate BottomNavigation component
- ✅ **Cross-Screen Navigation**: Seamless navigation between Dashboard and Rules screens

---

## 🔗 MULTI-PLATFORM INTEGRATION STRATEGY

### **React Native (Tenant) + React Vite.js (Landlord) Connection**

**AI Prompt**: "Implement the connection between React Native tenant app and React Vite.js landlord web app using Firebase backend. Set up shared authentication, real-time data synchronization, and cross-platform communication."

#### **Architecture Overview**
```
┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   React Vite.js │
│  (Tenant App)   │    │ (Landlord Web)  │
│   - Mobile UI   │    │   - Web UI      │
│   - Tenant Flow │    │   - Landlord    │
│   - Push Notif  │    │     Dashboard   │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
            ┌────────▼────────┐
            │   Firebase      │
            │   Backend       │
            │ - Authentication│
            │ - Firestore DB  │
            │ - Real-time     │
            │ - Storage       │
            │ - Functions     │
            └─────────────────┘
```

#### **Implementation Steps**

##### **Phase 1: Firebase Backend Setup**
```javascript
// Firebase Configuration (Shared)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "dorminder-app.firebaseapp.com",
  projectId: "dorminder-app",
  storageBucket: "dorminder-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Collections Structure
users: {
  userId: {
    email, name, role: 'tenant'|'landlord', 
    roomNumber, contractEnd, profileImage,
    createdAt, lastLogin
  }
}

payments: {
  paymentId: {
    userId, tenantId, landlordId,
    amount, date, status: 'pending'|'paid'|'overdue',
    type: 'rent'|'utilities'|'maintenance',
    dueDate, paidDate, receipt
  }
}

announcements: {
  announcementId: {
    title, body, date, authorId,
    priority: 'low'|'medium'|'high',
    status: 'active'|'archived',
    targetAudience: 'all'|'specific_tenants',
    tenantIds: []
  }
}

maintenance_requests: {
  requestId: {
    tenantId, landlordId, title, description,
    date, status: 'pending'|'in_progress'|'completed',
    priority: 'low'|'medium'|'high'|'urgent',
    images: [], assignedTo, estimatedCost
  }
}

notifications: {
  notificationId: {
    userId, type: 'payment'|'announcement'|'maintenance',
    title, body, read: false, createdAt,
    actionRequired: false, actionUrl
  }
}
```

##### **Phase 2: React Vite.js Landlord Web App**
```bash
# Create Landlord Web App
npm create vite@latest dorminder-landlord -- --template react
cd dorminder-landlord
npm install firebase @mui/material @emotion/react @emotion/styled @mui/icons-material axios react-router-dom

# Project Structure
dorminder-landlord/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── TenantList.jsx
│   │   │   ├── PaymentOverview.jsx
│   │   │   ├── MaintenanceRequests.jsx
│   │   │   └── AnnouncementManager.jsx
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── Layout.jsx
│   │   └── common/
│   │       ├── DataTable.jsx
│   │       ├── StatusBadge.jsx
│   │       └── ActionButton.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Tenants.jsx
│   │   ├── Payments.jsx
│   │   ├── Maintenance.jsx
│   │   ├── Announcements.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   ├── tenants.js
│   │   ├── payments.js
│   │   └── maintenance.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFirestore.js
│   │   └── useRealtime.js
│   └── utils/
│       ├── constants.js
│       └── helpers.js
```

##### **Phase 3: Shared Authentication System**
```javascript
// React Native (Tenant App)
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Login with role-based routing
const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  const userRole = userDoc.data().role;
  
  if (userRole === 'tenant') {
    navigation.navigate('TenantDashboard');
  } else if (userRole === 'landlord') {
    // Redirect to web app or show web link
    Linking.openURL('https://landlord.dorminder.com');
  }
};

// React Vite.js (Landlord Web App)
import { onAuthStateChanged } from 'firebase/auth';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        if (userData.role === 'landlord') {
          setUser(userData);
        } else {
          // Redirect tenant users to mobile app
          window.location.href = 'dorminder://tenant-dashboard';
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return { user, loading };
};
```

##### **Phase 4: Real-time Data Synchronization**
```javascript
// Real-time Updates for Both Apps
// React Native (Tenant)
import { onSnapshot, collection, query, where } from 'firebase/firestore';

const useRealtimeAnnouncements = (tenantId) => {
  const [announcements, setAnnouncements] = useState([]);
  
  useEffect(() => {
    const q = query(
      collection(db, 'announcements'),
      where('targetAudience', 'in', ['all', 'specific_tenants']),
      where('status', '==', 'active')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const announcementsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnouncements(announcementsData);
    });
    
    return unsubscribe;
  }, [tenantId]);
  
  return announcements;
};

// React Vite.js (Landlord)
const useRealtimeMaintenanceRequests = (landlordId) => {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    const q = query(
      collection(db, 'maintenance_requests'),
      where('landlordId', '==', landlordId),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
    });
    
    return unsubscribe;
  }, [landlordId]);
  
  return requests;
};
```

##### **Phase 5: Cross-Platform Communication**
```javascript
// Deep Linking for Mobile App
// React Native App.json
{
  "expo": {
    "scheme": "dorminder",
    "web": {
      "bundler": "metro"
    }
  }
}

// Web App Deep Link Handling
const handleDeepLink = (action, data) => {
  const deepLink = `dorminder://${action}?${new URLSearchParams(data)}`;
  
  // Try to open mobile app
  window.location.href = deepLink;
  
  // Fallback: Show QR code or download link
  setTimeout(() => {
    showMobileAppPrompt();
  }, 2000);
};

// Push Notifications (React Native)
import * as Notifications from 'expo-notifications';

const sendNotification = async (title, body, data) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Send immediately
  });
};

// Web Push Notifications (Landlord Web)
const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Subscribe to push notifications
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'your-vapid-key'
    });
    
    // Send subscription to Firebase
    await addDoc(collection(db, 'push_subscriptions'), {
      userId: user.uid,
      subscription,
      platform: 'web'
    });
  }
};
```

#### **Key Integration Points**

1. **Shared Firebase Project**: Both apps use the same Firebase project
2. **Role-based Authentication**: Users are redirected based on their role
3. **Real-time Updates**: Both apps receive live updates via Firestore listeners
4. **Cross-platform Notifications**: Push notifications for mobile, web notifications for desktop
5. **Deep Linking**: Web app can trigger mobile app actions
6. **Shared Data Models**: Consistent data structure across platforms

#### **Development Workflow**

1. **Setup Firebase Project**: Create shared Firebase project
2. **Configure Authentication**: Set up email/password and Google OAuth
3. **Design Database Schema**: Plan Firestore collections and security rules
4. **Build Landlord Web App**: Create React Vite.js application
5. **Implement Real-time Features**: Add Firestore listeners to both apps
6. **Test Cross-platform Flow**: Verify data sync and notifications
7. **Deploy Applications**: Deploy web app and publish mobile app

#### **Security Considerations**

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tenants can read announcements and create maintenance requests
    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'landlord';
    }
    
    // Maintenance requests: tenants create, landlords manage
    match /maintenance_requests/{requestId} {
      allow read: if request.auth != null && 
        (resource.data.tenantId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'landlord');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'landlord';
    }
  }
}
```

This comprehensive integration strategy ensures seamless communication between your React Native tenant app and React Vite.js landlord web application through a shared Firebase backend.
