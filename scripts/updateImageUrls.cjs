/**
 * Update Firestore Image URLs to WebP Format
 *
 * This script updates all imageUrl fields in Firestore collections
 * to use .webp extension instead of .png, .jpg, or .jpeg
 *
 * Run: node scripts/updateImageUrls.cjs
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');

if (!require('fs').existsSync(serviceAccountPath)) {
  console.error('❌ Error: firebase-service-account.json not found!');
  console.error('📋 Please download your service account key from:');
  console.error('   Firebase Console > Project Settings > Service Accounts');
  console.error('   Save it as: firebase-service-account.json');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Convert image URL to WebP format
 */
function convertToWebP(url) {
  if (!url) return url;
  return url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

/**
 * Update a single document's imageUrl field
 */
async function updateDocument(collectionName, docId, oldUrl, newUrl) {
  try {
    await db.collection(collectionName).doc(docId).update({
      imageUrl: newUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Updated ${collectionName}/${docId}`);
    console.log(`     ${oldUrl} → ${newUrl}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to update ${collectionName}/${docId}:`, error.message);
    return false;
  }
}

/**
 * Update all documents in a collection
 */
async function updateCollection(collectionName) {
  console.log(`\n📂 Processing collection: ${collectionName}`);

  try {
    const snapshot = await db.collection(collectionName).get();

    if (snapshot.empty) {
      console.log(`  ℹ️  No documents found`);
      return { total: 0, updated: 0, skipped: 0 };
    }

    let total = 0;
    let updated = 0;
    let skipped = 0;

    for (const doc of snapshot.docs) {
      total++;
      const data = doc.data();
      const imageUrl = data.imageUrl;

      // Skip if no imageUrl or already .webp
      if (!imageUrl) {
        console.log(`  ⏭️  Skipped ${doc.id} (no imageUrl)`);
        skipped++;
        continue;
      }

      if (imageUrl.endsWith('.webp')) {
        console.log(`  ⏭️  Skipped ${doc.id} (already .webp)`);
        skipped++;
        continue;
      }

      // Check if it's an image that needs conversion
      if (!/\.(png|jpg|jpeg)$/i.test(imageUrl)) {
        console.log(`  ⏭️  Skipped ${doc.id} (not a convertible image)`);
        skipped++;
        continue;
      }

      const newUrl = convertToWebP(imageUrl);
      const success = await updateDocument(collectionName, doc.id, imageUrl, newUrl);

      if (success) {
        updated++;
      } else {
        skipped++;
      }
    }

    console.log(`\n📊 ${collectionName} Summary:`);
    console.log(`   Total: ${total} | Updated: ${updated} | Skipped: ${skipped}`);

    return { total, updated, skipped };

  } catch (error) {
    console.error(`❌ Error processing ${collectionName}:`, error.message);
    return { total: 0, updated: 0, skipped: 0 };
  }
}

/**
 * Main migration function
 */
async function migrateImageUrls() {
  console.log('🔄 Starting Firestore Image URL Migration to WebP Format\n');
  console.log('=' .repeat(60));

  const collections = ['posts', 'projects', 'articles', 'notes'];
  const stats = {
    totalDocs: 0,
    totalUpdated: 0,
    totalSkipped: 0,
  };

  for (const collection of collections) {
    const result = await updateCollection(collection);
    stats.totalDocs += result.total;
    stats.totalUpdated += result.updated;
    stats.totalSkipped += result.skipped;
  }

  console.log('\n' + '=' .repeat(60));
  console.log('✅ Migration Complete!\n');
  console.log('📊 Overall Statistics:');
  console.log(`   Total documents: ${stats.totalDocs}`);
  console.log(`   Updated: ${stats.totalUpdated}`);
  console.log(`   Skipped: ${stats.totalSkipped}`);
  console.log('=' .repeat(60));
}

// Run migration
migrateImageUrls()
  .then(() => {
    console.log('\n🎉 All done! Your Firestore image URLs are now using WebP format.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
