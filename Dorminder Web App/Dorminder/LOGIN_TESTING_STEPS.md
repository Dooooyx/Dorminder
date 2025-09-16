# React Native Login Testing Steps

## 🚀 **App is Running!**

The React Native development server is now running. You should see:
- QR code in terminal
- Metro bundler running
- Expo DevTools available

## 📱 **Testing Methods:**

### **Option 1: Expo Go App (Recommended)**
1. Install "Expo Go" on your phone
2. Scan the QR code from terminal
3. App will load on your phone

### **Option 2: iOS Simulator**
1. Press `i` in terminal to open iOS simulator
2. App will load in simulator

### **Option 3: Android Emulator**
1. Press `a` in terminal to open Android emulator
2. App will load in emulator

## 🧪 **Test Scenarios:**

### **Test 1: Valid Tenant Login** ✅
**Prerequisites:** You need a tenant account created through the Landlord app

**Steps:**
1. Open the app on your device/simulator
2. You should see the Login screen
3. Enter tenant email (created via Landlord app)
4. Enter tenant password
5. Tap "Log In"

**Expected Result:**
- Button shows "Logging In..."
- Loading spinner appears
- Redirects to TenantDashboard
- No error messages

### **Test 2: Invalid Credentials** ❌
**Steps:**
1. Enter wrong email: `wrong@email.com`
2. Enter wrong password: `wrongpassword`
3. Tap "Log In"

**Expected Result:**
- Shows error message (Firebase error)
- Button returns to "Log In"
- Stays on login screen

### **Test 3: Empty Fields** ⚠️
**Steps:**
1. Leave email empty
2. Leave password empty
3. Tap "Log In"

**Expected Result:**
- Shows "Please fill in all fields"
- Input fields highlight

### **Test 4: Landlord Access Denial** 🚫
**Steps:**
1. Enter landlord email (from Landlord app)
2. Enter landlord password
3. Tap "Log In"

**Expected Result:**
- Shows "Access denied. This app is for tenants only."
- Stays on login screen

### **Test 5: Password Reset** 🔄
**Steps:**
1. Enter valid email address
2. Tap "Forgot password?"
3. Check email for reset link

**Expected Result:**
- Shows "Password reset email sent!"
- Check email inbox

## 🔍 **Debug Information:**

If login fails, check the console for detailed error messages:
- Network errors
- Firebase authentication errors
- Role validation errors

## 📝 **Creating Test Tenant Account:**

If you don't have a tenant account yet:

1. **Open Landlord App:**
   ```bash
   cd ../Landlord
   npm run dev
   ```

2. **Login as Landlord**
3. **Go to Tenants page**
4. **Click "Add New Tenant"**
5. **Fill in tenant details:**
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@test.com`
   - Password: `password123`
   - Contact Number: `0912-345-6789`
   - Other required fields
6. **Submit the form**
7. **Check email for verification link**
8. **Click verification link**
9. **Use these credentials in React Native app**

## ✅ **Success Indicators:**

- ✅ App loads without errors
- ✅ Login screen displays correctly
- ✅ Input fields work properly
- ✅ Error messages show appropriately
- ✅ Loading states work
- ✅ Valid login redirects to dashboard
- ✅ Invalid login shows errors
- ✅ Password reset sends email

## 🚨 **Common Issues:**

1. **"Network Error"** - Check internet connection
2. **"Invalid API Key"** - Check .env file
3. **"User not found"** - Tenant account not created
4. **"Access denied"** - Using landlord credentials

## 🎯 **Next Steps After Testing:**

Once login works:
1. Implement tenant dashboard
2. Add tenant data display
3. Connect to Firestore for tenant info
4. Add tenant-specific features

The login backend is ready for testing! 🚀
