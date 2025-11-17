# Super Admin Account Setup Guide

This guide explains how to create the super admin account in Firebase Authentication.

## Method 1: Using the Script (Recommended)

The easiest way is to use the provided script that creates the account programmatically.

### Steps:

1. **Navigate to the Backend functions directory:**
   ```bash
   cd Backend/functions
   ```

2. **Make sure you're authenticated with Firebase:**
   ```bash
   firebase login
   ```

3. **Set your Firebase project (if not already set):**
   ```bash
   firebase use <your-project-id>
   ```
   Or if you need to see available projects:
   ```bash
   firebase projects:list
   ```

4. **Run the script:**
   ```bash
   npm run create-super-admin
   ```
   
   Or directly:
   ```bash
   node create-super-admin.js
   ```

5. **The script will:**
   - Create the super admin user in Firebase Authentication
   - Set email as verified (no email verification needed)
   - Create a user document in Firestore with role 'superadmin'
   - Set the password to 'Testing@1234'

### Expected Output:
```
🔐 Creating super admin account...
   Email: superadmin@gmail.com
   Creating new user...
✅ User created successfully with UID: <uid>
   Creating Firestore user document...
✅ Firestore document created

🎉 Super Admin account setup complete!
   Email: superadmin@gmail.com
   Password: Testing@1234
   UID: <uid>

✅ You can now log in to the super admin panel.
```

---

## Method 2: Manual Creation via Firebase Console

If you prefer to create it manually:

1. **Go to Firebase Console:**
   - Visit https://console.firebase.google.com
   - Select your project

2. **Navigate to Authentication:**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Add User:**
   - Click "Add user" button
   - Enter email: `superadmin@gmail.com`
   - Enter password: `Testing@1234`
   - Click "Add user"

4. **Verify Email:**
   - Find the user in the list
   - Click the three dots menu
   - Select "Verify email" (or manually set emailVerified to true)

5. **Create Firestore Document:**
   - Go to Firestore Database
   - Navigate to `users` collection
   - Create a new document with the user's UID
   - Add these fields:
     ```json
     {
       "uid": "<user-uid>",
       "email": "superadmin@gmail.com",
       "displayName": "Super Admin",
       "role": "superadmin",
       "emailVerified": true,
       "enabled": true,
       "createdAt": <timestamp>,
       "updatedAt": <timestamp>
     }
     ```

---

## Method 3: Using Firebase CLI

You can also use Firebase CLI to create the user:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create user (requires Firebase Admin SDK setup)
# This method is more complex and requires additional setup
```

---

## Verification

After creating the account, verify it works:

1. **Go to the Landlord login page**
2. **Enter credentials:**
   - Email: `superadmin@gmail.com`
   - Password: `Testing@1234`
3. **You should be redirected to `/super-admin` page**

---

## Troubleshooting

### Error: "User already exists"
- The script will update the existing user instead of creating a new one
- This is safe and won't cause issues

### Error: "Permission denied"
- Make sure you're logged in with Firebase CLI: `firebase login`
- Make sure you have admin access to the Firebase project

### Error: "Project not found"
- Set the Firebase project: `firebase use <project-id>`
- Or check your `.firebaserc` file

### Script doesn't run
- Make sure you're in the `Backend/functions` directory
- Make sure `firebase-admin` is installed: `npm install`
- Check that Node.js version is 18 or higher

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change the password** in production environments
2. **Use environment variables** for sensitive credentials
3. **Restrict access** to the super admin account
4. **Monitor super admin activity** in Firebase Console
5. **Consider using Firebase Custom Claims** for more secure role management

---

## Next Steps

After creating the super admin account:

1. ✅ Test login with the credentials
2. ✅ Verify you can see the landlord management page
3. ✅ Test enabling/disabling a landlord account
4. ✅ Verify disabled landlords cannot log in

---

## Support

If you encounter any issues:
1. Check the Firebase Console for error logs
2. Verify your Firebase project configuration
3. Ensure all dependencies are installed
4. Check that Firebase Admin SDK is properly initialized

