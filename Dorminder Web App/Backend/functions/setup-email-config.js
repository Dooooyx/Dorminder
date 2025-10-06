const admin = require('firebase-admin');

// Initialize Firebase Admin with the current project
admin.initializeApp();
const db = admin.firestore();

async function setupEmailConfig() {
  try {
    // Replace these with your actual Gmail credentials
    const emailConfig = {
      gmailUser: 'arsu.pantinople.swu@phinmaed.com"',        // Replace with your Gmail
      gmailPassword: 'cnffbwtfytytfmrw',   // Replace with your app password
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('config').doc('email').set(emailConfig);
    console.log('✅ Email configuration successfully set in Firestore!');
    console.log('📧 Gmail User:', emailConfig.gmailUser);
    console.log('🔑 Password length:', emailConfig.gmailPassword.length, 'characters');
  } catch (error) {
    console.error('❌ Error setting up email configuration:', error);
  } finally {
    process.exit(0);
  }
}

setupEmailConfig();