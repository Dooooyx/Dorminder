# Email Verification Setup Guide

## Issue: "Failed to send verification email"

This error typically occurs due to Firebase configuration issues. Here's how to fix it:

## 1. Firebase Console Configuration

### Step 1: Enable Email Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `dorminder-web-app-925c1`
3. Go to **Authentication** → **Sign-in method**
4. Make sure **Email/Password** is enabled
5. Click on **Email/Password** and ensure it's enabled

### Step 2: Configure Authorized Domains
1. In **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - `dorminder-web-app-925c1.firebaseapp.com`
   - Your production domain (when deployed)

### Step 3: Check Email Templates
1. Go to **Authentication** → **Templates**
2. Click on **Email address verification**
3. Ensure the template is enabled
4. Customize the email template if needed

## 2. Common Issues and Solutions

### Issue 1: Domain Not Authorized
**Error**: `auth/unauthorized-continue-uri`
**Solution**: Add your domain to authorized domains in Firebase Console

### Issue 2: Email Provider Blocking
**Error**: Email not received
**Solution**: 
- Check spam folder
- Try with a different email provider (Gmail, Outlook)
- Check if your email provider blocks automated emails

### Issue 3: Firebase Quota Exceeded
**Error**: `auth/too-many-requests`
**Solution**: Wait before trying again, or upgrade Firebase plan

### Issue 4: Invalid Configuration
**Error**: `auth/invalid-api-key`
**Solution**: Check your Firebase configuration in `.env.local`

## 3. Testing Email Verification

### Test 1: Check Console Logs
1. Open browser developer tools
2. Go to Console tab
3. Try to register a new account
4. Look for error messages in console

### Test 2: Check Firebase Console
1. Go to Firebase Console → Authentication → Users
2. Check if user was created
3. Look for any error indicators

### Test 3: Test with Different Email
1. Try with a Gmail account
2. Try with a different email provider
3. Check if the issue is email-specific

## 4. Alternative Solutions

### Option 1: Skip Email Verification (Development Only)
If you want to skip email verification for development:

```javascript
// In auth.js, comment out the email verification
// await sendEmailVerification(user);
```

### Option 2: Manual Verification
1. Go to Firebase Console → Authentication → Users
2. Find the user
3. Click on the user
4. Click "Send email verification" manually

### Option 3: Use Firebase Admin SDK
For production, consider using Firebase Admin SDK for more control over email verification.

## 5. Environment Variables Check

Make sure your `.env.local` file has the correct Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=dorminder-web-app-925c1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dorminder-web-app-925c1
VITE_FIREBASE_STORAGE_BUCKET=dorminder-web-app-925c1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=556474579423
VITE_FIREBASE_APP_ID=1:556474579423:web:34554fa010f5ecd635ec6a
```

## 6. Debug Steps

1. **Check Firebase Console** for any error messages
2. **Check browser console** for detailed error logs
3. **Test with different email addresses**
4. **Verify Firebase project settings**
5. **Check network connectivity**

## 7. Quick Fix for Development

If you want to bypass email verification for now:

1. Comment out the email verification in `auth.js`
2. Set `emailVerified: true` in the user document
3. This allows immediate access to the dashboard

## 8. Production Considerations

For production deployment:
- Set up proper email templates
- Configure custom domain
- Set up email delivery monitoring
- Consider using a dedicated email service

## Support

If the issue persists:
1. Check Firebase Console for error logs
2. Review browser console for detailed errors
3. Test with a fresh Firebase project
4. Contact Firebase support if needed
