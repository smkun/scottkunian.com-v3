/**
 * Content Backup Script
 *
 * Backs up all content from Firestore to JSON files
 * Run with: node scripts/backupContent.cjs
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Backup configuration
const BACKUP_DIR = path.join(__dirname, '../backups');
const COLLECTIONS = ['posts', 'projects', 'notes', 'articles'];

/**
 * Ensure backup directory exists
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
  }
}

/**
 * Convert Firestore Timestamp to ISO string
 */
function serializeTimestamp(data) {
  const serialized = { ...data };

  Object.keys(serialized).forEach(key => {
    const value = serialized[key];

    // Handle Firestore Timestamps
    if (value && typeof value.toDate === 'function') {
      serialized[key] = value.toDate().toISOString();
    }
    // Handle nested objects
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      serialized[key] = serializeTimestamp(value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      serialized[key] = value.map(item =>
        item && typeof item === 'object' ? serializeTimestamp(item) : item
      );
    }
  });

  return serialized;
}

/**
 * Backup a single collection
 */
async function backupCollection(collectionName) {
  console.log(`\n📥 Backing up ${collectionName}...`);

  try {
    const snapshot = await db.collection(collectionName).get();

    const documents = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const serialized = serializeTimestamp(data);

      documents.push({
        id: doc.id,
        ...serialized
      });
    });

    console.log(`   Found ${documents.length} documents`);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${collectionName}_${timestamp}.json`;
    const filepath = path.join(BACKUP_DIR, filename);

    // Write to file
    fs.writeFileSync(filepath, JSON.stringify(documents, null, 2), 'utf8');

    console.log(`   ✅ Saved to ${filename}`);

    return {
      collection: collectionName,
      count: documents.length,
      file: filename
    };
  } catch (error) {
    console.error(`   ❌ Error backing up ${collectionName}:`, error.message);
    return {
      collection: collectionName,
      count: 0,
      file: null,
      error: error.message
    };
  }
}

/**
 * Create backup manifest
 */
function createManifest(results) {
  const manifest = {
    timestamp: new Date().toISOString(),
    collections: results,
    totalDocuments: results.reduce((sum, r) => sum + r.count, 0)
  };

  const manifestPath = path.join(BACKUP_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\n📋 Backup manifest created: manifest.json`);
}

/**
 * Main backup function
 */
async function main() {
  console.log('💾 Starting content backup...\n');
  console.log(`Backup directory: ${BACKUP_DIR}`);

  // Ensure backup directory exists
  ensureBackupDir();

  // Backup all collections
  const results = [];
  for (const collection of COLLECTIONS) {
    const result = await backupCollection(collection);
    results.push(result);
  }

  // Create manifest
  createManifest(results);

  // Summary
  console.log('\n📊 Backup Summary:');
  console.log('==================');

  results.forEach(result => {
    const status = result.error ? '❌' : '✅';
    console.log(`${status} ${result.collection}: ${result.count} documents`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  const totalDocs = results.reduce((sum, r) => sum + r.count, 0);
  const totalErrors = results.filter(r => r.error).length;

  console.log('\n📁 Total documents backed up: ' + totalDocs);
  console.log(`📍 Backup location: ${BACKUP_DIR}`);

  if (totalErrors > 0) {
    console.log(`⚠️  ${totalErrors} collection(s) had errors`);
  } else {
    console.log('✅ Backup completed successfully!');
  }

  console.log('\n💡 To restore from backup:');
  console.log('   Use the manifest.json file to identify backup files');
  console.log('   Import JSON files back to Firestore as needed');

  process.exit(totalErrors > 0 ? 1 : 0);
}

// Run backup
main().catch(error => {
  console.error('❌ Backup failed:', error);
  process.exit(1);
});
