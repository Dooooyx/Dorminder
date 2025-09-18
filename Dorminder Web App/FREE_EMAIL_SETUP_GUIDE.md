# 📧 Free Email Setup Guide (No Firebase Functions Required)

## 🎯 Overview
This guide shows you how to set up email notifications for tenant registration **without using Firebase Cloud Functions** (which require a paid plan). Instead, we'll use **EmailJS** - a free email service that works with the Firebase Spark plan.

## ✅ What This Setup Provides
- ✅ **Tenant Registration Emails** - Complete registration details sent to tenant
- ✅ **Landlord Notification Emails** - Registration summary sent to landlord  
- ✅ **No Firebase Functions Required** - Works with free Firebase Spark plan
- ✅ **Professional Email Templates** - Beautiful HTML emails
- ✅ **All Registration Data Included** - Complete tenant information

## 🚀 Step 1: Set Up EmailJS Account

### 1.1 Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a **free account** (200 emails/month free)
3. Verify your email address

### 1.2 Add Email Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (or your preferred email provider)
4. Follow the setup instructions
5. **Save your Service ID** (e.g., `service_xxxxxxx`)

## 📧 Step 2: Create Email Templates

### 2.1 Tenant Credentials Template
1. Go to **"Email Templates"** in EmailJS dashboard
2. Click **"Create New Template"**
3. Use this template ID: `tenant_credentials`
4. **Subject**: `Welcome to Dorminder - Your Account & Registration Details`
5. **HTML Content** (copy the template from the code below)

### 2.2 Landlord Notification Template  
1. Create another template
2. Use this template ID: `landlord_notification`
3. **Subject**: `New Tenant Registered - {{tenant_name}} at {{property_name}}`
4. **HTML Content** (copy the template from the code below)

## 🔧 Step 3: Install EmailJS in Your Project

### 3.1 Install Package
```bash
cd "/Users/danallenpantinople/Dorminder Web App/Landlord"
npm install @emailjs/browser
```

### 3.2 Update Email Service
Replace the content in `/Landlord/src/services/emailServiceFree.js` with the actual EmailJS implementation:

```javascript
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('YOUR_PUBLIC_KEY');

export const emailServiceFree = {
  async sendTenantCredentials(tenantData) {
    try {
      const templateParams = {
        to_email: tenantData.tenantEmail,
        tenant_name: tenantData.tenantName,
        password: tenantData.password,
        landlord_name: tenantData.landlordName,
        property_name: tenantData.propertyName,
        first_name: tenantData.firstName,
        last_name: tenantData.lastName,
        middle_initial: tenantData.middleInitial,
        contact_number: tenantData.contactNumber,
        email_address: tenantData.emailAddress,
        emergency_contact_name: tenantData.emergencyContactName,
        emergency_contact_number: tenantData.emergencyContactNumber,
        account_email: tenantData.accountEmail,
        room_number: tenantData.roomNumber,
        rent_amount: tenantData.rentAmount,
        initial_payment_status: tenantData.initialPaymentStatus,
        lease_start_date: tenantData.leaseStartDate,
        lease_end_date: tenantData.leaseEndDate,
        status: tenantData.status
      };

      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your service ID
        'tenant_credentials', // Template ID
        templateParams
      );

      return { success: true, result };
    } catch (error) {
      console.error('EmailJS error:', error);
      throw error;
    }
  },

  async sendLandlordNotification(tenantData) {
    try {
      const templateParams = {
        to_email: tenantData.landlordEmail,
        landlord_name: tenantData.landlordName,
        property_name: tenantData.propertyName,
        tenant_name: tenantData.tenantName,
        first_name: tenantData.firstName,
        last_name: tenantData.lastName,
        middle_initial: tenantData.middleInitial,
        contact_number: tenantData.contactNumber,
        email_address: tenantData.emailAddress,
        emergency_contact_name: tenantData.emergencyContactName,
        emergency_contact_number: tenantData.emergencyContactNumber,
        account_email: tenantData.accountEmail,
        room_number: tenantData.roomNumber,
        rent_amount: tenantData.rentAmount,
        initial_payment_status: tenantData.initialPaymentStatus,
        lease_start_date: tenantData.leaseStartDate,
        lease_end_date: tenantData.leaseEndDate,
        status: tenantData.status
      };

      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your service ID
        'landlord_notification', // Template ID
        templateParams
      );

      return { success: true, result };
    } catch (error) {
      console.error('EmailJS error:', error);
      throw error;
    }
  }
};
```

## 📝 Step 4: Email Templates

### 4.1 Tenant Credentials Template HTML
```html
<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
  <div style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Dorminder!</h1>
    <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 16px;">Your digital dormitory management platform</p>
  </div>
  
  <div style="padding: 30px; background-color: #ffffff;">
    <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello {{tenant_name}},</p>
    <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">Your landlord <strong>{{landlord_name}}</strong> has registered you at <strong>{{property_name}}</strong>. Below are your complete registration details:</p>
    
    <!-- Login Credentials -->
    <div style="background-color: #F3F4F6; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #1E40AF;">
      <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">🔐 Login Credentials</h3>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Email:</strong> {{account_email}}</p>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Password:</strong> {{password}}</p>
      <p style="margin: 15px 0 0 0; font-size: 14px; color: #6B7280; font-style: italic;">Please change your password after first login for security.</p>
    </div>

    <!-- Tenant Information -->
    <div style="background-color: #F8FAFC; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #E5E7EB;">
      <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">👤 Tenant Information</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
        <div><strong>First Name:</strong> {{first_name}}</div>
        <div><strong>Last Name:</strong> {{last_name}}</div>
        <div><strong>Middle Initial:</strong> {{middle_initial}}</div>
        <div><strong>Contact Number:</strong> {{contact_number}}</div>
        <div><strong>Email Address:</strong> {{email_address}}</div>
        <div><strong>Emergency Contact:</strong> {{emergency_contact_name}}</div>
        <div><strong>Emergency Number:</strong> {{emergency_contact_number}}</div>
        <div><strong>Status:</strong> {{status}}</div>
      </div>
    </div>

    <!-- Lease Details -->
    <div style="background-color: #F0FDF4; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #BBF7D0;">
      <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">🏠 Lease Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
        <div><strong>Room Number:</strong> {{room_number}}</div>
        <div><strong>Rent Amount:</strong> {{rent_amount}}</div>
        <div><strong>Initial Payment Status:</strong> {{initial_payment_status}}</div>
        <div><strong>Lease Start Date:</strong> {{lease_start_date}}</div>
        <div><strong>Lease End Date:</strong> {{lease_end_date}}</div>
        <div><strong>Property:</strong> {{property_name}}</div>
      </div>
    </div>

    <!-- Next Steps -->
    <div style="background-color: #FEF3C7; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #FCD34D;">
      <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">📱 Next Steps</h3>
      <ol style="color: #374151; line-height: 1.6;">
        <li>Download the Dorminder mobile app</li>
        <li>Log in using the credentials provided above</li>
        <li>Change your password for security</li>
        <li>Complete your profile setup</li>
        <li>Familiarize yourself with the app features</li>
      </ol>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; font-size: 14px; margin: 0;">Best regards,<br><strong>The Dorminder Team</strong></p>
    </div>
  </div>
</div>
```

### 4.2 Landlord Notification Template HTML
```html
<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
  <div style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">New Tenant Registered!</h1>
    <p style="color: #D1FAE5; margin: 10px 0 0 0; font-size: 16px;">Tenant registration completed successfully</p>
  </div>
  
  <div style="padding: 30px; background-color: #ffffff;">
    <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello {{landlord_name}},</p>
    <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">A new tenant has been successfully registered at your property <strong>{{property_name}}</strong>. Below are the complete registration details:</p>
    
    <!-- Tenant Summary -->
    <div style="background-color: #F0FDF4; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #10B981;">
      <h3 style="color: #059669; margin-top: 0; font-size: 20px;">✅ Registration Summary</h3>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Tenant Name:</strong> {{tenant_name}}</p>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Room:</strong> {{room_number}}</p>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Rent Amount:</strong> {{rent_amount}}</p>
      <p style="margin: 8px 0; font-size: 16px;"><strong>Status:</strong> {{status}}</p>
    </div>

    <!-- Tenant Information -->
    <div style="background-color: #F8FAFC; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #E5E7EB;">
      <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">👤 Tenant Information</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
        <div><strong>First Name:</strong> {{first_name}}</div>
        <div><strong>Last Name:</strong> {{last_name}}</div>
        <div><strong>Middle Initial:</strong> {{middle_initial}}</div>
        <div><strong>Contact Number:</strong> {{contact_number}}</div>
        <div><strong>Email Address:</strong> {{email_address}}</div>
        <div><strong>Emergency Contact:</strong> {{emergency_contact_name}}</div>
        <div><strong>Emergency Number:</strong> {{emergency_contact_number}}</div>
        <div><strong>Account Email:</strong> {{account_email}}</div>
      </div>
    </div>

    <!-- Lease Details -->
    <div style="background-color: #FEF3C7; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #FCD34D;">
      <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">🏠 Lease Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
        <div><strong>Room Number:</strong> {{room_number}}</div>
        <div><strong>Rent Amount:</strong> {{rent_amount}}</div>
        <div><strong>Initial Payment Status:</strong> {{initial_payment_status}}</div>
        <div><strong>Lease Start Date:</strong> {{lease_start_date}}</div>
        <div><strong>Lease End Date:</strong> {{lease_end_date}}</div>
        <div><strong>Property:</strong> {{property_name}}</div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; font-size: 14px; margin: 0;">Best regards,<br><strong>The Dorminder Team</strong></p>
    </div>
  </div>
</div>
```

## 🔑 Step 5: Get Your EmailJS Keys

1. In EmailJS dashboard, go to **"Account"** → **"General"**
2. Copy your **Public Key** (e.g., `user_xxxxxxxxx`)
3. Copy your **Service ID** from step 1.2
4. Replace `YOUR_PUBLIC_KEY` and `YOUR_SERVICE_ID` in the code

## ✅ Step 6: Test the Setup

1. **Register a new tenant** in your app
2. **Check the browser console** for email data logs
3. **Check your email** for the notifications
4. **Verify both emails** are received (tenant + landlord)

## 🎯 Benefits of This Approach

- ✅ **No Firebase Functions required** - Works with free plan
- ✅ **200 free emails/month** with EmailJS
- ✅ **Professional email templates** - Beautiful HTML emails
- ✅ **Easy to set up** - No complex server configuration
- ✅ **Reliable delivery** - EmailJS handles delivery
- ✅ **Cost-effective** - Free tier available

## 🚨 Important Notes

- **EmailJS free tier**: 200 emails/month
- **Upgrade available**: If you need more emails
- **No server required**: Everything runs client-side
- **Secure**: EmailJS handles authentication
- **Professional**: Same quality as Firebase Functions

## 🔧 Troubleshooting

### Common Issues:
1. **Emails not sending**: Check your EmailJS service configuration
2. **Template errors**: Verify template variables match exactly
3. **Authentication issues**: Ensure your public key is correct
4. **Rate limits**: Check if you've exceeded the free tier limit

### Debug Steps:
1. Check browser console for error messages
2. Verify EmailJS dashboard shows sent emails
3. Test with a simple template first
4. Check spam folders for delivered emails

---

**🎉 That's it!** Your email system is now set up without requiring Firebase Cloud Functions or a paid plan!
