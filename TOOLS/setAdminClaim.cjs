/**
 * Script to set admin custom claim for scottkunian@gmail.com
 *
 * Run with: node scripts/setAdminClaim.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your service account
// You'll need to download the service account key from Firebase Console:
// Project Settings > Service Accounts > Generate New Private Key
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const ADMIN_EMAIL = 'scottkunian@gmail.com';

async function setAdminClaim() {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
    console.log(`Found user: ${user.email} (UID: ${user.uid})`);

    // Set admin custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin claim successfully set for ${ADMIN_EMAIL}`);

    // Verify the claim was set
    const userRecord = await admin.auth().getUser(user.uid);
    console.log('Custom claims:', userRecord.customClaims);

    console.log('\n⚠️  IMPORTANT: User must sign out and sign in again for the claim to take effect.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin claim:', error.message);
    process.exit(1);
  }
}

setAdminClaim();
