const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Simple health check function
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).send('Firebase Functions are running!');
});

// You can add other non-email functions here as needed