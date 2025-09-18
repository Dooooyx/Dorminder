# Emailer Service Setup Guide for Dorminder

## 📧 Overview
This guide focuses specifically on setting up the email service for Dorminder. Since authentication is already working, this covers only the email functionality setup.

## 🔧 Prerequisites
- Firebase project already set up
- Authentication working
- Firebase CLI installed
- Gmail account

## 🚀 Step 1: Install Firebase Functions Dependencies

Navigate to the Backend functions directory:
```bash
cd "Dorminder Web App/Backend/functions"
```

Install the required packages:
```bash
npm install nodemailer cors
```

## 📧 Step 2: Gmail App Password Setup

### 2.1 Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the setup process if not already enabled

### 2.2 Generate App Password
1. In Google Account Security, scroll to "2-Step Verification"
2. Click **App passwords**
3. Select app: **Mail**
4. Select device: **Other (custom name)**
5. Enter name: "Dorminder Email Service"
6. Click **Generate**
7. **Copy the 16-character password** (you won't see it again!)

## ⚙️ Step 3: Configure Firebase Functions

### 3.1 Set Gmail Credentials
Run these commands in the Backend/functions directory:

```bash
# Set your Gmail credentials
firebase functions:config:set gmail.user="your-email@gmail.com" gmail.password="your-16-char-app-password"

# Example:
# firebase functions:config:set gmail.user="john.doe@gmail.com" gmail.password="abcd efgh ijkl mnop"
```

### 3.2 Verify Configuration
```bash
# Check if config was set correctly
firebase functions:config:get
```

You should see:
```
gmail:
  user: your-email@gmail.com
  password: your-16-char-app-password
```

## 🚀 Step 4: Deploy Firebase Functions

### 4.1 Deploy Email Functions
```bash
# Deploy only the functions
firebase deploy --only functions
```

### 4.2 Verify Deployment
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Functions** section
3. You should see these functions deployed:
   - `sendTenantCredentials`
   - `notifyLandlordNewRequest`
   - `sendEmail`

## 🧪 Step 5: Test Email Service

### 5.1 Test from Landlord Dashboard
1. Go to your landlord dashboard
2. Try adding a new tenant with complete information:
   - **Tenant Information**: First Name, Last Name, Middle Initial, Contact Number, Email, Emergency Contact
   - **Account Information**: Email, Password
   - **Lease Details**: Room Selection, Rent Amount, Payment Status, Lease Dates, Status
3. Check the tenant's email for **comprehensive registration details**

### 5.2 Test from Tenant App
1. Submit a new request from tenant app
2. Check landlord's email for notification

### 5.3 Check Function Logs
If emails aren't sending, check the logs:
```bash
firebase functions:log
```

Look for any error messages related to email sending.

### 5.4 Email Content Verification
The tenant email should now include:
- ✅ **Login Credentials** (Email & Password)
- ✅ **Complete Tenant Information** (All personal details)
- ✅ **Lease Details** (Room, Rent, Dates, Status)
- ✅ **Next Steps** (App download, login instructions)
- ✅ **Contact Information** (Landlord details)

## 🔧 Step 6: Troubleshooting Email Issues

### Common Problems:

#### "Invalid login" Error
- **Problem**: Gmail credentials are wrong
- **Solution**: 
  1. Double-check the app password (16 characters, no spaces)
  2. Make sure 2FA is enabled
  3. Re-generate app password if needed

#### "Function not found" Error
- **Problem**: Functions not deployed properly
- **Solution**:
  ```bash
  firebase deploy --only functions
  ```

#### "Permission denied" Error
- **Problem**: Firebase project permissions
- **Solution**: Make sure you're logged in with correct account
  ```bash
  firebase login
  firebase use your-project-id
  ```

#### Emails Going to Spam
- **Problem**: Gmail filtering
- **Solution**: 
  1. Check spam folder
  2. Add sender to contacts
  3. Consider using a custom domain for production

## 📝 Step 7: Email Templates Customization

### 7.1 Tenant Credentials Email
The email template is in `/Backend/functions/src/index.js` in the `sendTenantCredentials` function. You can customize:
- Email subject
- HTML template
- Styling
- Content

### 7.2 Request Notification Email
The template is in the `notifyLandlordNewRequest` function. You can customize:
- Notification format
- Information included
- Styling

## 🔒 Step 8: Production Considerations

### 8.1 Use Custom Domain (Recommended)
For production, consider using a custom email service:
- SendGrid
- Mailgun
- AWS SES

### 8.2 Rate Limiting
Gmail has sending limits:
- 500 emails per day (free account)
- 2000 emails per day (paid account)

### 8.3 Monitoring
Set up monitoring for:
- Email delivery rates
- Function execution time
- Error rates

## ✅ Quick Setup Checklist

- [ ] Install nodemailer and cors packages
- [ ] Enable 2FA on Gmail account
- [ ] Generate Gmail app password
- [ ] Set Firebase Functions config
- [ ] Deploy functions
- [ ] Test tenant creation email
- [ ] Test request notification email
- [ ] Check function logs for errors

## 🚨 Important Notes

1. **Keep App Password Secure**: Don't commit it to version control
2. **Test Thoroughly**: Always test email functionality before going live
3. **Monitor Usage**: Keep track of Gmail sending limits
4. **Backup Plan**: Have a fallback email service for production

## 📞 Quick Commands Reference

```bash
# Set email config
firebase functions:config:set gmail.user="email@gmail.com" gmail.password="app-password"

# Deploy functions
firebase deploy --only functions

# Check logs
firebase functions:log

# Check config
firebase functions:config:get

# Clear config (if needed)
firebase functions:config:unset gmail
```

---

**That's it!** Your email service should now be working. The system will automatically send emails when:
- Landlords add new tenants (credentials email)
- Tenants submit requests (notification email to landlord)
