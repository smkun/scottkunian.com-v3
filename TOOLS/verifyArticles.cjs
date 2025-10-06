/**
 * Verify Articles in Firestore
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function verifyArticles() {
  console.log('🔍 Verifying Articles in Firestore\n');

  try {
    const snapshot = await db.collection('articles').get();

    console.log(`📊 Total articles in Firestore: ${snapshot.size}\n`);

    if (snapshot.empty) {
      console.log('❌ No articles found in Firestore!');
      process.exit(1);
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`✅ ${data.title}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   URL: ${data.url}`);
      console.log(`   Source: ${data.source}`);
      console.log(`   Visible: ${data.isVisible}`);
      console.log(`   Image: ${data.imageUrl || 'No image'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

verifyArticles();
