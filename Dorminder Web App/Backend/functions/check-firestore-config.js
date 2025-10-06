const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

async function checkFirestoreConfig() {
  try {
    console.log('🔍 Checking Firestore email configuration...');
    
    // Check global config
    const configDoc = await db.collection('config').doc('email').get();
    if (configDoc.exists) {
      const config = configDoc.data();
      console.log('✅ Global config found:');
      console.log('  - Gmail User:', config.gmailUser);
      console.log('  - Password length:', config.gmailPassword ? config.gmailPassword.length : 'undefined');
    } else {
      console.log('❌ Global config not found');
    }
    
    // Check landlord credentials
    const landlordCredsSnapshot = await db.collection('landlordEmailCredentials').get();
    console.log(`📧 Found ${landlordCredsSnapshot.size} landlord email credentials:`);
    
    landlordCredsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  - Landlord ID: ${doc.id}`);
      console.log(`    - Gmail User: ${data.gmailUser}`);
      console.log(`    - Password length: ${data.gmailPassword ? data.gmailPassword.length : 'undefined'}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking Firestore config:', error);
  }
}

checkFirestoreConfig();
