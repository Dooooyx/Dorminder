const admin = require('firebase-admin');

// Initialize Firebase Admin with explicit project ID
admin.initializeApp({
  projectId: 'dorminder-web-app-925c1'
});
const db = admin.firestore();

async function addGmailConfig() {
  try {
    console.log('📧 Adding Gmail configuration to Firestore...');
    
    // Add global email configuration
    const emailConfig = {
      gmailUser: 'arsu.pantinople.swu@phinmaed.com',
      gmailPassword: 'cnffbwtfytytfmrw', // 16-character App Password
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('config').doc('email').set(emailConfig);
    console.log('✅ Global email configuration added successfully!');
    
    // Also add it to landlordEmailCredentials for the specific landlord
    // You'll need to replace 'LANDLORD_UID_HERE' with the actual landlord UID
    const landlordEmailConfig = {
      landlordId: 'LANDLORD_UID_HERE', // Replace with actual landlord UID
      gmailUser: 'arsu.pantinople.swu@phinmaed.com',
      gmailPassword: 'cnffbwtfytytfmrw',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Uncomment this when you have the actual landlord UID
    // await db.collection('landlordEmailCredentials').doc('LANDLORD_UID_HERE').set(landlordEmailConfig);
    // console.log('✅ Landlord email configuration added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding Gmail configuration:', error);
  }
}

addGmailConfig();
