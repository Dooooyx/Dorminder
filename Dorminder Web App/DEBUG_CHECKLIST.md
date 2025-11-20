# Request Not Showing on Landlord Side - Debug Checklist

## Problem
Tenant submits request from mobile app → Request doesn't appear on landlord's web app

## Root Cause
The `propertyId` field needs to match between:
- Tenant's profile
- Submitted request  
- Landlord's UID

## Debug Steps

### 1. Check Mobile App Logs
After submitting a request, check React Native logs for:
```
🔍 Tenant Data for Request: {
  tenantId: "abc123...",
  propertyId: "xyz789...",    ← COPY THIS VALUE
  landlordId: "xyz789...",
  tenantName: "John Doe",
  category: "request"
}
```

### 2. Check Web App Logs
On landlord web app (browser console), you should see:
```
🔍 Landlord querying requests with: {
  propertyId: "xyz789...",    ← SHOULD MATCH TENANT'S PROPERTYID
  status: "pending",
  category: "request"
}
```

### 3. Compare Values

**They MUST match:**
- Tenant's `propertyId` = Landlord's `user.uid`

**If they don't match, continue below...**

---

## Solution

### Option A: Check Firebase Console Directly

1. Open: https://console.firebase.google.com/project/dorminder-web-app-925c1/firestore/data

2. Click on `tenants` collection → Find your tenant → Check `propertyId`

3. Click on `requests` collection → Find submitted request → Check `propertyId`

4. Check landlord authentication → Get landlord's UID

5. **All three should be the same!**

### Option B: Fix in Code

If tenant's `propertyId` is wrong, it was set incorrectly during registration.

**When registering a tenant from landlord web app:**

In `AddTenantModal.jsx` (line 374):
```javascript
const result = await tenantService.createTenant(tenantData, user?.email, user?.uid);
                                                                         ^^^^^^^^
                                                            This becomes the propertyId
```

The `user.uid` of the **landlord** should be saved as the tenant's `propertyId`.

---

## Quick Test

### Test Data Flow:

```
LANDLORD (Web App)
└─ UID: "landlord123xyz"
   └─ Creates Tenant
      └─ Tenant saved with: propertyId = "landlord123xyz"

TENANT (Mobile App)  
└─ Logs in
   └─ Tenant profile has: propertyId = "landlord123xyz"
      └─ Submits request with: propertyId = "landlord123xyz"

LANDLORD (Web App)
└─ Queries: WHERE propertyId == "landlord123xyz"
   └─ ✅ Finds the request!
```

---

## Still Not Working?

### Check These:

1. **Firestore indexes** - Make sure they finished building (5-10 min after deployment)
   - Check: https://console.firebase.google.com/project/dorminder-web-app-925c1/firestore/indexes
   - Status should be "Enabled" (not "Building")

2. **Firebase permissions** - Check `firestore.rules` allows reading/writing requests

3. **Network issues** - Check browser network tab for failed requests

4. **Cache** - Hard refresh both apps (Ctrl+Shift+R or Cmd+Shift+R)

---

## Contact Info
If still not working, share these debug logs:
- Mobile app console output (tenant submission)
- Web app console output (landlord query)
- Screenshot of Firebase Console showing the request document







