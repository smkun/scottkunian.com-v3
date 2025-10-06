/**
 * Content Restore Script
 *
 * Restores content from JSON backup files to Firestore
 * Run with: node scripts/restoreContent.cjs <backup-file>
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

/**
 * Parse ISO date strings back to Firestore Timestamps
 */
function deserializeTimestamps(data) {
  const deserialized = { ...data };

  Object.keys(deserialized).forEach(key => {
    const value = deserialized[key];

    // Check if value looks like an ISO date string
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      try {
        deserialized[key] = admin.firestore.Timestamp.fromDate(new Date(value));
      } catch (e) {
        // Keep original value if parsing fails
      }
    }
    // Handle nested objects
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      deserialized[key] = deserializeTimestamps(value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      deserialized[key] = value.map(item =>
        item && typeof item === 'object' ? deserializeTimestamps(item) : item
      );
    }
  });

  return deserialized;
}

/**
 * Restore collection from backup file
 */
async function restoreCollection(backupFile, dryRun = true) {
  console.log(`\n📤 Restoring from ${path.basename(backupFile)}...`);

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No data will be written\n');
  }

  try {
    // Read backup file
    const fileContent = fs.readFileSync(backupFile, 'utf8');
    const documents = JSON.parse(fileContent);

    console.log(`   Found ${documents.length} documents to restore`);

    // Determine collection name from filename
    const filename = path.basename(backupFile);
    const collectionName = filename.split('_')[0];

    console.log(`   Target collection: ${collectionName}`);

    // Restore documents in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = db.batch();
      const currentBatch = documents.slice(i, i + batchSize);

      for (const doc of currentBatch) {
        try {
          const { id, ...data } = doc;
          const deserialized = deserializeTimestamps(data);

          if (!dryRun) {
            const docRef = db.collection(collectionName).doc(id);
            batch.set(docRef, deserialized);
          }

          successCount++;
          process.stdout.write('✅');
        } catch (error) {
          errorCount++;
          process.stdout.write('❌');
        }
      }

      if (!dryRun) {
        await batch.commit();
      }
    }

    console.log('\n');
    console.log(`   ✅ Successfully processed: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   ❌ Errors: ${errorCount}`);
    }

    return {
      collection: collectionName,
      total: documents.length,
      success: successCount,
      errors: errorCount
    };
  } catch (error) {
    console.error(`   ❌ Error restoring:`, error.message);
    throw error;
  }
}

/**
 * Main restore function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Usage: node scripts/restoreContent.cjs <backup-file> [--no-dry-run]');
    console.error('\nExample:');
    console.error('  node scripts/restoreContent.cjs backups/posts_2025-10-05T12-00-00-000Z.json');
    console.error('  node scripts/restoreContent.cjs backups/posts_2025-10-05T12-00-00-000Z.json --no-dry-run');
    process.exit(1);
  }

  const backupFile = args[0];
  const dryRun = !args.includes('--no-dry-run');

  // Validate backup file exists
  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Backup file not found: ${backupFile}`);
    process.exit(1);
  }

  console.log('📥 Content Restore Tool\n');
  console.log(`Backup file: ${backupFile}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE RESTORE'}`);

  if (!dryRun) {
    console.log('\n⚠️  WARNING: This will write data to Firestore!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Restore collection
  const result = await restoreCollection(backupFile, dryRun);

  // Summary
  console.log('\n📊 Restore Summary:');
  console.log('==================');
  console.log(`Collection: ${result.collection}`);
  console.log(`Total documents: ${result.total}`);
  console.log(`Successfully processed: ${result.success}`);
  if (result.errors > 0) {
    console.log(`Errors: ${result.errors}`);
  }

  if (dryRun) {
    console.log('\n⚠️  This was a DRY RUN. No data was written to Firestore.');
    console.log('   Run with --no-dry-run to perform actual restore.');
  } else {
    console.log('\n✅ Restore completed!');
  }

  process.exit(result.errors > 0 ? 1 : 0);
}

// Run restore
main().catch(error => {
  console.error('❌ Restore failed:', error);
  process.exit(1);
});
