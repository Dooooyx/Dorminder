const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

async function setupEmailConfig() {
  try {
    console.log('📧 Setting up email configuration in Firestore...');
    
    // Add global email configuration
    const emailConfig = {
      gmailUser: 'arsu.pantinople.swu@phinmaed.com',
      gmailPassword: 'cnffbwtfytytfmrw', // 16-character App Password
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('config').doc('email').set(emailConfig);
    console.log('✅ Global email configuration added successfully!');
    
    // Verify it was added
    const configDoc = await db.collection('config').doc('email').get();
    if (configDoc.exists) {
      const config = configDoc.data();
      console.log('✅ Verification successful:');
      console.log('  - Gmail User:', config.gmailUser);
      console.log('  - Password length:', config.gmailPassword ? config.gmailPassword.length : 'undefined');
    }
    
  } catch (error) {
    console.error('❌ Error setting up email configuration:', error);
  }
}

setupEmailConfig();
