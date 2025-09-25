const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail?.user || 'your-email@gmail.com',
    pass: functions.config().gmail?.password || 'your-app-password'
  }
});

// Function to send tenant credentials email
exports.sendTenantCredentials = functions.https.onCall(async (data, context) => {
  try {
    const { 
      tenantEmail, 
      tenantName, 
      password, 
      landlordName, 
      propertyName,
      // Tenant Information
      firstName,
      lastName,
      middleInitial,
      contactNumber,
      emailAddress,
      emergencyContactName,
      emergencyContactNumber,
      // Account Information
      accountEmail,
      // Lease Details
      roomNumber,
      rentAmount,
      initialPaymentStatus,
      leaseStartDate,
      leaseEndDate,
      status
    } = data;

    const mailOptions = {
      from: functions.config().gmail?.user || 'your-email@gmail.com',
      to: tenantEmail,
      subject: 'Welcome to Dorminder - Your Account & Registration Details',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Dorminder!</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 16px;">Your digital dormitory management platform</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello ${tenantName},</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">Your landlord <strong>${landlordName}</strong> has registered you at <strong>${propertyName}</strong>. Below are your complete registration details:</p>
            
            <!-- Login Credentials -->
            <div style="background-color: #F3F4F6; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #1E40AF;">
              <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">🔐 Login Credentials</h3>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Email:</strong> ${accountEmail || tenantEmail}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Password:</strong> ${password}</p>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #6B7280; font-style: italic;">Please change your password after first login for security.</p>
            </div>

            <!-- Tenant Information -->
            <div style="background-color: #F8FAFC; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #E5E7EB;">
              <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">👤 Tenant Information</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div><strong>First Name:</strong> ${firstName || 'N/A'}</div>
                <div><strong>Last Name:</strong> ${lastName || 'N/A'}</div>
                <div><strong>Middle Initial:</strong> ${middleInitial || 'N/A'}</div>
                <div><strong>Contact Number:</strong> ${contactNumber || 'N/A'}</div>
                <div><strong>Email Address:</strong> ${emailAddress || 'N/A'}</div>
                <div><strong>Emergency Contact:</strong> ${emergencyContactName || 'N/A'}</div>
                <div><strong>Emergency Number:</strong> ${emergencyContactNumber || 'N/A'}</div>
                <div><strong>Status:</strong> ${status || 'N/A'}</div>
              </div>
            </div>

            <!-- Lease Details -->
            <div style="background-color: #F0FDF4; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #BBF7D0;">
              <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">🏠 Lease Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div><strong>Room Number:</strong> ${roomNumber || 'N/A'}</div>
                <div><strong>Rent Amount:</strong> ${rentAmount || 'N/A'}</div>
                <div><strong>Initial Payment Status:</strong> ${initialPaymentStatus || 'N/A'}</div>
                <div><strong>Lease Start Date:</strong> ${leaseStartDate || 'N/A'}</div>
                <div><strong>Lease End Date:</strong> ${leaseEndDate || 'N/A'}</div>
                <div><strong>Property:</strong> ${propertyName || 'N/A'}</div>
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

            <!-- Contact Information -->
            <div style="background-color: #EFF6FF; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #BFDBFE;">
              <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">📞 Need Help?</h3>
              <p style="color: #374151; margin: 10px 0;">If you have any questions or need assistance, please contact your landlord:</p>
              <p style="color: #374151; margin: 5px 0;"><strong>Landlord:</strong> ${landlordName}</p>
              <p style="color: #374151; margin: 5px 0;"><strong>Property:</strong> ${propertyName}</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 14px; margin: 0;">Best regards,<br><strong>The Dorminder Team</strong></p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Credentials sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

// Function to send tenant registration notification to landlord
exports.sendTenantRegistrationNotification = functions.https.onCall(async (data, context) => {
  try {
    const { 
      landlordEmail, 
      landlordName, 
      propertyName,
      // Tenant Information
      tenantName,
      firstName,
      lastName,
      middleInitial,
      contactNumber,
      emailAddress,
      emergencyContactName,
      emergencyContactNumber,
      // Account Information
      accountEmail,
      // Lease Details
      roomNumber,
      rentAmount,
      initialPaymentStatus,
      leaseStartDate,
      leaseEndDate,
      status
    } = data;

    const mailOptions = {
      from: functions.config().gmail?.user || 'your-email@gmail.com',
      to: landlordEmail,
      subject: `New Tenant Registered - ${tenantName} at ${propertyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">New Tenant Registered!</h1>
            <p style="color: #D1FAE5; margin: 10px 0 0 0; font-size: 16px;">Tenant registration completed successfully</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hello ${landlordName},</p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">A new tenant has been successfully registered at your property <strong>${propertyName}</strong>. Below are the complete registration details:</p>
            
            <!-- Tenant Summary -->
            <div style="background-color: #F0FDF4; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #10B981;">
              <h3 style="color: #059669; margin-top: 0; font-size: 20px;">✅ Registration Summary</h3>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Tenant Name:</strong> ${tenantName}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Room:</strong> ${roomNumber || 'N/A'}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Rent Amount:</strong> ${rentAmount || 'N/A'}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Status:</strong> ${status || 'N/A'}</p>
            </div>

            <!-- Tenant Information -->
            <div style="background-color: #F8FAFC; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #E5E7EB;">
              <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">👤 Tenant Information</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div><strong>First Name:</strong> ${firstName || 'N/A'}</div>
                <div><strong>Last Name:</strong> ${lastName || 'N/A'}</div>
                <div><strong>Middle Initial:</strong> ${middleInitial || 'N/A'}</div>
                <div><strong>Contact Number:</strong> ${contactNumber || 'N/A'}</div>
                <div><strong>Email Address:</strong> ${emailAddress || 'N/A'}</div>
                <div><strong>Emergency Contact:</strong> ${emergencyContactName || 'N/A'}</div>
                <div><strong>Emergency Number:</strong> ${emergencyContactNumber || 'N/A'}</div>
                <div><strong>Account Email:</strong> ${accountEmail || 'N/A'}</div>
              </div>
            </div>

            <!-- Lease Details -->
            <div style="background-color: #FEF3C7; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #FCD34D;">
              <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">🏠 Lease Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div><strong>Room Number:</strong> ${roomNumber || 'N/A'}</div>
                <div><strong>Rent Amount:</strong> ${rentAmount || 'N/A'}</div>
                <div><strong>Initial Payment Status:</strong> ${initialPaymentStatus || 'N/A'}</div>
                <div><strong>Lease Start Date:</strong> ${leaseStartDate || 'N/A'}</div>
                <div><strong>Lease End Date:</strong> ${leaseEndDate || 'N/A'}</div>
                <div><strong>Property:</strong> ${propertyName || 'N/A'}</div>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background-color: #EFF6FF; padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px solid #BFDBFE;">
              <h3 style="color: #1E40AF; margin-top: 0; font-size: 20px;">📋 Next Steps</h3>
              <ol style="color: #374151; line-height: 1.6;">
                <li>Review the tenant's information in your dashboard</li>
                <li>Verify the lease details and payment status</li>
                <li>Contact the tenant if any clarification is needed</li>
                <li>Set up any additional property-specific requirements</li>
                <li>Monitor the tenant's account activity</li>
              </ol>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 14px; margin: 0;">Best regards,<br><strong>The Dorminder Team</strong></p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Landlord notification sent successfully' };
  } catch (error) {
    console.error('Error sending landlord notification email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send landlord notification email');
  }
});

// Function to send new request notification to landlord
exports.notifyLandlordNewRequest = functions.https.onCall(async (data, context) => {
  try {
    const { landlordEmail, tenantName, requestTitle, requestDescription, propertyName } = data;

    const mailOptions = {
      from: functions.config().gmail?.user || 'your-email@gmail.com',
      to: landlordEmail,
      subject: `New Request from ${tenantName} - ${propertyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1E40AF;">New Request Received</h2>
          <p>Hello,</p>
          <p>You have received a new request from tenant ${tenantName} at ${propertyName}.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1E40AF; margin-top: 0;">Request Details:</h3>
            <p><strong>Title:</strong> ${requestTitle}</p>
            <p><strong>Description:</strong> ${requestDescription}</p>
            <p><strong>Tenant:</strong> ${tenantName}</p>
            <p><strong>Property:</strong> ${propertyName}</p>
          </div>
          
          <p>Please log in to your Dorminder dashboard to view and manage this request.</p>
          
          <p>Best regards,<br>The Dorminder Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Landlord notified successfully' };
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification email');
  }
});

// HTTP function for CORS-enabled requests
exports.sendEmail = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    try {
      const { type, data } = req.body;

      if (type === 'tenant-credentials') {
        const result = await exports.sendTenantCredentials.run(data, {});
        return res.status(200).json(result);
      } else if (type === 'new-request') {
        const result = await exports.notifyLandlordNewRequest.run(data, {});
        return res.status(200).json(result);
      } else {
        return res.status(400).json({ error: 'Invalid email type' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Firestore trigger: Send email when new tenant is created
exports.onTenantCreated = functions.firestore
  .document('tenants/{tenantId}')
  .onCreate(async (snap, context) => {
    try {
      const tenantData = snap.data();
      const tenantId = context.params.tenantId;

      // Get landlord info from the tenant data or fetch from users collection
      const landlordData = await admin.firestore()
        .collection('users')
        .doc(tenantData.landlordId)
        .get();

      if (!landlordData.exists) {
        console.error('Landlord not found for tenant:', tenantId);
        return;
      }

      const landlord = landlordData.data();

      // Send tenant credentials email
      await exports.sendTenantCredentials.run({
        tenantEmail: tenantData.email,
        tenantName: `${tenantData.firstName} ${tenantData.lastName}`,
        password: tenantData.tempPassword,
        landlordName: landlord.name || landlord.email,
        propertyName: tenantData.propertyName || 'Your Property',
        // Tenant Information
        firstName: tenantData.firstName,
        lastName: tenantData.lastName,
        middleInitial: tenantData.middleInitial,
        contactNumber: tenantData.contactNumber,
        emailAddress: tenantData.email,
        emergencyContactName: tenantData.emergencyContactName,
        emergencyContactNumber: tenantData.emergencyContactNumber,
        // Account Information
        accountEmail: tenantData.email,
        // Lease Details
        roomNumber: tenantData.roomNumber,
        rentAmount: tenantData.rentAmount,
        initialPaymentStatus: tenantData.initialPaymentStatus,
        leaseStartDate: tenantData.leaseStartDate,
        leaseEndDate: tenantData.leaseEndDate,
        status: tenantData.status
      }, {});

      // Send landlord notification
      await exports.sendTenantRegistrationNotification.run({
        landlordEmail: landlord.email,
        landlordName: landlord.name || landlord.email,
        propertyName: tenantData.propertyName || 'Your Property',
        // Tenant Information
        tenantName: `${tenantData.firstName} ${tenantData.lastName}`,
        firstName: tenantData.firstName,
        lastName: tenantData.lastName,
        middleInitial: tenantData.middleInitial,
        contactNumber: tenantData.contactNumber,
        emailAddress: tenantData.email,
        emergencyContactName: tenantData.emergencyContactName,
        emergencyContactNumber: tenantData.emergencyContactNumber,
        // Account Information
        accountEmail: tenantData.email,
        // Lease Details
        roomNumber: tenantData.roomNumber,
        rentAmount: tenantData.rentAmount,
        initialPaymentStatus: tenantData.initialPaymentStatus,
        leaseStartDate: tenantData.leaseStartDate,
        leaseEndDate: tenantData.leaseEndDate,
        status: tenantData.status
      }, {});

      console.log('Emails sent successfully for tenant:', tenantId);
    } catch (error) {
      console.error('Error in onTenantCreated trigger:', error);
    }
  });

// Firestore trigger: Send email when new request is created
exports.onRequestCreated = functions.firestore
  .document('requests/{requestId}')
  .onCreate(async (snap, context) => {
    try {
      const requestData = snap.data();
      const requestId = context.params.requestId;

      // Get tenant info
      const tenantData = await admin.firestore()
        .collection('tenants')
        .doc(requestData.tenantId)
        .get();

      if (!tenantData.exists) {
        console.error('Tenant not found for request:', requestId);
        return;
      }

      const tenant = tenantData.data();

      // Get landlord info
      const landlordData = await admin.firestore()
        .collection('users')
        .doc(tenant.landlordId)
        .get();

      if (!landlordData.exists) {
        console.error('Landlord not found for request:', requestId);
        return;
      }

      const landlord = landlordData.data();

      // Send notification email to landlord
      await exports.notifyLandlordNewRequest.run({
        landlordEmail: landlord.email,
        tenantName: `${tenant.firstName} ${tenant.lastName}`,
        requestTitle: requestData.title,
        requestDescription: requestData.description,
        propertyName: tenant.propertyName || 'Your Property'
      }, {});

      console.log('Request notification sent successfully for request:', requestId);
    } catch (error) {
      console.error('Error in onRequestCreated trigger:', error);
    }
  });
