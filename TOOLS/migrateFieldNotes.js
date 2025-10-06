/**
 * Field Notes Migration Script
 *
 * Migrates existing Field Notes content to Firestore
 * Run with: node scripts/migrateFieldNotes.js
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
 * Sample migration data structure
 * Replace this with your actual Field Notes data source
 */
const sampleNotes = [
  {
    content: 'This is a sample field note that would be migrated.',
    tags: ['sample', 'migration'],
    type: 'quick',
    mood: 'neutral',
    isPublic: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    content: 'Another sample note with more detailed content. This could be from an existing data source.',
    tags: ['example', 'test'],
    type: 'detailed',
    mood: 'happy',
    isPublic: true,
    createdAt: new Date('2024-02-20'),
  },
];

/**
 * Parse Field Notes from existing data source
 * TODO: Implement actual data source parsing
 * Options:
 * - CSV file parsing
 * - JSON file import
 * - HTML scraping from existing site
 * - Database export
 */
function parseFieldNotesData(dataSource) {
  console.log('📖 Parsing Field Notes data source...');

  // TODO: Replace with actual parsing logic
  // Example implementations:

  // Option 1: JSON file
  // const data = JSON.parse(fs.readFileSync(dataSource, 'utf8'));
  // return data.notes;

  // Option 2: CSV file
  // const csv = require('csv-parser');
  // const notes = [];
  // fs.createReadStream(dataSource)
  //   .pipe(csv())
  //   .on('data', (row) => notes.push(parseNoteRow(row)))
  //   .on('end', () => console.log('CSV parsed'));
  // return notes;

  // Option 3: Use sample data for now
  return sampleNotes;
}

/**
 * Validate note data before migration
 */
function validateNote(note) {
  const required = ['content', 'tags', 'type', 'isPublic', 'createdAt'];
  const missing = required.filter(field => !(field in note));

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (typeof note.content !== 'string' || note.content.length === 0) {
    throw new Error('Content must be a non-empty string');
  }

  if (!Array.isArray(note.tags)) {
    throw new Error('Tags must be an array');
  }

  if (!['quick', 'detailed'].includes(note.type)) {
    throw new Error('Type must be "quick" or "detailed"');
  }

  if (typeof note.isPublic !== 'boolean') {
    throw new Error('isPublic must be a boolean');
  }

  return true;
}

/**
 * Transform note data to Firestore format
 */
function transformNoteForFirestore(note) {
  return {
    content: note.content,
    tags: note.tags,
    type: note.type,
    mood: note.mood || null,
    isPublic: note.isPublic,
    createdAt: admin.firestore.Timestamp.fromDate(
      note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt)
    ),
    // Optional fields
    ...(note.location && { location: note.location }),
    ...(note.imageUrl && { imageUrl: note.imageUrl }),
  };
}

/**
 * Migrate notes to Firestore
 */
async function migrateNotes(notes, options = {}) {
  const { dryRun = false, batchSize = 50 } = options;

  console.log(`\n🚀 Starting migration of ${notes.length} notes...`);
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No data will be written to Firestore\n');
  }

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Process notes in batches
  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = db.batch();
    const currentBatch = notes.slice(i, i + batchSize);

    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(notes.length / batchSize)}`);

    for (const note of currentBatch) {
      try {
        // Validate note
        validateNote(note);

        // Transform for Firestore
        const firestoreNote = transformNoteForFirestore(note);

        if (!dryRun) {
          // Create document reference
          const docRef = db.collection('notes').doc();
          batch.set(docRef, firestoreNote);
        }

        successCount++;
        process.stdout.write('✅');
      } catch (error) {
        errorCount++;
        errors.push({ note, error: error.message });
        process.stdout.write('❌');
      }
    }

    // Commit batch
    if (!dryRun) {
      await batch.commit();
    }
  }

  // Summary
  console.log('\n\n📊 Migration Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(({ note, error }, index) => {
      console.log(`\n${index + 1}. ${error}`);
      console.log(`   Content: ${note.content?.substring(0, 50)}...`);
    });
  }

  if (dryRun) {
    console.log('\n⚠️  This was a DRY RUN. Run with --no-dry-run to actually migrate data.');
  } else {
    console.log('\n✅ Migration complete!');
  }
}

/**
 * Main migration function
 */
async function main() {
  try {
    // Parse command-line arguments
    const args = process.argv.slice(2);
    const dryRun = !args.includes('--no-dry-run');
    const dataSource = args.find(arg => !arg.startsWith('--')) || null;

    // Parse notes from data source
    const notes = parseFieldNotesData(dataSource);

    console.log('📋 Field Notes Migration Script');
    console.log('================================\n');
    console.log(`Data source: ${dataSource || 'sample data'}`);
    console.log(`Notes found: ${notes.length}`);
    console.log(`Dry run: ${dryRun ? 'Yes' : 'No'}`);

    if (notes.length === 0) {
      console.log('\n⚠️  No notes found to migrate.');
      process.exit(0);
    }

    // Confirm before proceeding
    if (!dryRun) {
      console.log('\n⚠️  WARNING: This will write data to Firestore.');
      console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Run migration
    await migrateNotes(notes, { dryRun });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration
main();
