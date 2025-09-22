# Rules Debug Guide

## 🔍 **Issue: Rules Not Showing on Tenant Side**

The problem was that the tenant was using their own `uid` as the `propertyId`, but rules are stored under the landlord's `uid` (property ID).

## ✅ **Fix Applied:**

1. **Added tenant data service import**
2. **Updated fetchRules to get correct property ID** from tenant data
3. **Added detailed console logging** for debugging

## 🧪 **Test Steps:**

### **Step 1: Check Console Logs**
Look for these debug messages in the console:

```
Getting tenant data for user: [tenant-uid]
Tenant property ID: [landlord-uid]
Rules data received: [rules-array]
```

### **Step 2: Verify Tenant Data**
1. **Make sure tenant is properly registered** in the Landlord app
2. **Check that tenant has a `propertyId`** field in their data
3. **Verify the propertyId matches** the landlord's uid

### **Step 3: Test Rules Creation**
1. **Go to Landlord app** (React.js)
2. **Navigate to "Rules" page**
3. **Click "Create Default Rules"**
4. **Verify rules are created** in the Landlord app

### **Step 4: Test Rules Display**
1. **Go to Tenant app** (React Native)
2. **Navigate to "Rules" tab**
3. **Check console logs** for debug information
4. **Verify rules appear** on the tenant side

## 🚨 **Troubleshooting:**

### **If "Tenant data not found":**
- Tenant needs to be registered in the Landlord app first
- Check that tenant has `propertyId` field in their data

### **If "Property ID not found":**
- Tenant data exists but missing `propertyId` field
- Need to update tenant data structure

### **If "Rules data received: Array(0)":**
- Rules haven't been created by the landlord yet
- Go to Landlord app and create some rules

### **If "Rules error":**
- Check Firestore indexes are built
- Verify rules collection exists
- Check console for specific error messages

## 📊 **Expected Console Output:**

### **Successful Flow:**
```
Getting tenant data for user: tenant-123
Tenant property ID: landlord-456
Rules data received: [array of rules]
```

### **Error Cases:**
```
Getting tenant data for user: tenant-123
Tenant not found: Tenant not found
```

## 🎯 **Next Steps:**

1. **Check console logs** for debug information
2. **Verify tenant is registered** in Landlord app
3. **Create rules** in Landlord app if none exist
4. **Test rules display** in Tenant app

The fix should resolve the rules display issue! 🚀

**Check the console logs and let me know what you see!**


