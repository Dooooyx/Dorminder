const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

async function setupGlobalEmail() {
  try {
    // Replace these with your actual Gmail credentials for testing
    const emailConfig = {
      gmailUser: 'arsu.pantinople.swu@phinmaed.com',        // Replace with your Gmail
      gmailPassword: 'cnffbwtfytytfmrw',   // Replace with your app password
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('config').doc('email').set(emailConfig);
    console.log('✅ Global email configuration set successfully!');
    console.log('📧 Gmail User:', emailConfig.gmailUser);
    console.log('🔑 Password length:', emailConfig.gmailPassword.length, 'characters');
    console.log('💡 This will be used as fallback when landlord credentials are not available');
  } catch (error) {
    console.error('❌ Error setting up global email configuration:', error);
  } finally {
    process.exit(0);
  }
}

setupGlobalEmail();
