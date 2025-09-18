# Create Test Tenant Account

## 🚀 **Quick Setup for Testing**

To test the React Native login, you need to create a tenant account first through the Landlord app.

### **Step 1: Start Landlord App**
```bash
cd ../Landlord
npm run dev
```

### **Step 2: Login as Landlord**
1. Open http://localhost:5173
2. Login with your landlord credentials
3. Go to Dashboard

### **Step 3: Create Test Tenant**
1. Click "Tenants" in the sidebar
2. Click "Add New Tenant" button
3. Fill in the form:

**Required Fields:**
- **First Name:** `John`
- **Last Name:** `Doe`
- **Email:** `john.doe@test.com`
- **Password:** `password123`
- **Contact Number:** `0912-345-6789`
- **Emergency Contact Name:** `Jane Doe`
- **Emergency Contact Number:** `0912-345-6790`
- **Valid ID Number:** `123456789`
- **Rent Amount:** `5000`
- **Lease Start Date:** Today's date
- **Lease End Date:** 1 year from today

**Optional Fields:**
- Middle Initial: `M`
- Valid ID Image: Upload any image

4. **Click "Add Tenant"**
5. **Check your email for verification link**
6. **Click the verification link to verify the account**

### **Step 4: Test in React Native**
1. Go back to React Native app
2. Use these credentials:
   - **Email:** `john.doe@test.com`
   - **Password:** `password123`
3. Tap "Log In"

## ✅ **Expected Results:**
- Tenant account created successfully
- Email verification sent
- React Native login works
- Redirects to TenantDashboard

## 🚨 **Troubleshooting:**
- **"User not found"** - Check if tenant was created successfully
- **"Email not verified"** - Click verification link in email
- **"Access denied"** - Make sure tenant has role 'tenant'

## 🎯 **Alternative Test Credentials:**
If you want to create multiple test accounts:

**Account 2:**
- Email: `jane.smith@test.com`
- Password: `password123`

**Account 3:**
- Email: `bob.wilson@test.com`
- Password: `password123`

Just repeat the process above with different names and emails.

The test tenant account is ready for React Native login testing! 🚀

