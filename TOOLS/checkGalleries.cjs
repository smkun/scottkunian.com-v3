#!/usr/bin/env node

/**
 * Check Galleries in Firestore
 *
 * Quick script to verify galleries exist and show their data
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
try {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Could not load firebase-service-account.json');
  console.log('This script requires Firebase Admin SDK credentials.');
  console.log('Trying to query via Firebase client SDK instead...\n');
  process.exit(1);
}

const db = admin.firestore();

async function checkGalleries() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║     Firestore Galleries Check         ║');
  console.log('╚═══════════════════════════════════════╝\n');

  try {
    const snapshot = await db.collection('galleries').get();

    if (snapshot.empty) {
      console.log('📭 No galleries found in Firestore\n');
      return;
    }

    console.log(`📚 Found ${snapshot.size} gallery/galleries:\n`);

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('═══════════════════════════════════════');
      console.log(`ID: ${doc.id}`);
      console.log(`Name: ${data.name}`);
      console.log(`Slug: ${data.slug}`);
      console.log(`Folder: ${data.folderPath}`);
      console.log(`Visible: ${data.isVisible ? '✅' : '❌'}`);
      console.log(`Images: ${data.imageCount || 0}`);
      console.log(`Sort Order: ${data.sortOrder}`);
      if (data.description) {
        console.log(`Description: ${data.description.substring(0, 60)}...`);
      }
      console.log('');
    });

    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error querying Firestore:', error.message);
  }

  process.exit(0);
}

checkGalleries();
