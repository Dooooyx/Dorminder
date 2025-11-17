// Quick script to check and fix tenant propertyId
// Run this with: node fix-tenant-propertyId.js

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./Backend/functions/serviceAccountKey.json'); // Adjust path if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkTenantPropertyIds() {
  try {
    console.log('🔍 Checking tenant propertyIds...\n');
    
    const tenantsSnapshot = await db.collection('tenants').get();
    
    if (tenantsSnapshot.empty) {
      console.log('❌ No tenants found in database');
      return;
    }
    
    console.log(`Found ${tenantsSnapshot.size} tenant(s):\n`);
    
    tenantsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`Tenant: ${data.firstName} ${data.lastName}`);
      console.log(`  - Tenant ID: ${doc.id}`);
      console.log(`  - User ID: ${data.userId}`);
      console.log(`  - Property ID: ${data.propertyId}`);
      console.log(`  - Email: ${data.email}`);
      console.log('');
    });
    
    console.log('\n📋 Next steps:');
    console.log('1. Note the propertyId for each tenant');
    console.log('2. Check if it matches your landlord UID');
    console.log('3. If not, we can update it');
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

checkTenantPropertyIds();





