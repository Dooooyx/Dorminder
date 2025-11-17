const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

async function createSuperAdmin() {
  try {
    const email = 'superadmin@gmail.com';
    const password = 'Testing@1234';
    const displayName = 'Super Admin';

    console.log('🔐 Creating super admin account...');
    console.log(`   Email: ${email}`);
    
    // Check if user already exists
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log('⚠️  User already exists with UID:', user.uid);
      console.log('   Updating user...');
      
      // Update the existing user
      await auth.updateUser(user.uid, {
        email: email,
        emailVerified: true,
        displayName: displayName,
        password: password
      });
      
      console.log('✅ User updated successfully');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, create new one
        console.log('   Creating new user...');
        user = await auth.createUser({
          email: email,
          password: password,
          emailVerified: true,
          displayName: displayName
        });
        console.log('✅ User created successfully with UID:', user.uid);
      } else {
        throw error;
      }
    }

    // Create or update user document in Firestore
    const userDocRef = db.collection('users').doc(user.uid);
    const userDoc = await userDocRef.get();
    
    if (userDoc.exists) {
      console.log('   Updating Firestore user document...');
      await userDocRef.update({
        role: 'superadmin',
        email: email,
        displayName: displayName,
        emailVerified: true,
        enabled: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Firestore document updated');
    } else {
      console.log('   Creating Firestore user document...');
      await userDocRef.set({
        uid: user.uid,
        email: email,
        displayName: displayName,
        role: 'superadmin',
        emailVerified: true,
        enabled: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Firestore document created');
    }

    console.log('\n🎉 Super Admin account setup complete!');
    console.log('   Email: superadmin@gmail.com');
    console.log('   Password: Testing@1234');
    console.log('   UID:', user.uid);
    console.log('\n✅ You can now log in to the super admin panel.');
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    process.exit(1);
  }
  
  process.exit(0);
}

createSuperAdmin();

