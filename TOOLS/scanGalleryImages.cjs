#!/usr/bin/env node

/**
 * Gallery Image Scanner
 *
 * This script scans the /public/images/gallery/ folders and updates
 * the imageCount field in Firestore gallery categories.
 *
 * Usage:
 *   node scripts/scanGalleryImages.cjs
 *
 * Requirements:
 *   - Firebase Admin SDK initialized
 *   - firebase-service-account.json in project root
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const GALLERY_PATH = path.join(__dirname, '../public/images/gallery');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

/**
 * Count images in a folder
 */
function countImagesInFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️  Folder not found: ${folderPath}`);
      return 0;
    }

    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });

    return imageFiles.length;
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error.message);
    return 0;
  }
}

/**
 * Get first image from folder for cover image
 */
function getFirstImage(folderPath, folderName) {
  try {
    if (!fs.existsSync(folderPath)) {
      return null;
    }

    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });

    if (imageFiles.length > 0) {
      return `/images/gallery/${folderName}/${imageFiles[0]}`;
    }

    return null;
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error.message);
    return null;
  }
}

/**
 * Update all gallery categories with image counts
 */
async function updateGalleryCounts() {
  try {
    console.log('🔍 Scanning gallery categories...\n');

    const snapshot = await db.collection('galleries').get();

    if (snapshot.empty) {
      console.log('📭 No gallery categories found in Firestore.');
      console.log('💡 Create categories in the admin panel first!\n');
      return;
    }

    let updated = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
      const category = doc.data();
      const folderPath = path.join(GALLERY_PATH, category.folderPath);

      console.log(`📁 Processing: ${category.name}`);
      console.log(`   Folder: ${category.folderPath}`);

      const imageCount = countImagesInFolder(folderPath);
      const coverImage = category.coverImage || getFirstImage(folderPath, category.folderPath);

      if (imageCount === 0) {
        console.log(`   ⚠️  No images found in folder`);
      } else {
        console.log(`   ✅ Found ${imageCount} images`);
      }

      try {
        const updateData = {
          imageCount,
          updatedAt: admin.firestore.Timestamp.now()
        };

        // Only update coverImage if we found one and it's not already set
        if (coverImage && !category.coverImage) {
          updateData.coverImage = coverImage;
          console.log(`   🖼️  Set cover image: ${coverImage}`);
        }

        await db.collection('galleries').doc(doc.id).update(updateData);
        updated++;
      } catch (error) {
        console.error(`   ❌ Error updating category:`, error.message);
        errors++;
      }

      console.log('');
    }

    console.log('═══════════════════════════════════════');
    console.log(`✅ Updated: ${updated} categories`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} categories`);
    }
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

/**
 * List all folders in /public/images/gallery/
 */
function listGalleryFolders() {
  console.log('\n📂 Available folders in /public/images/gallery/:\n');

  if (!fs.existsSync(GALLERY_PATH)) {
    console.log('⚠️  Gallery directory does not exist yet.');
    console.log(`   Create it at: ${GALLERY_PATH}\n`);
    return;
  }

  const items = fs.readdirSync(GALLERY_PATH);
  const folders = items.filter(item => {
    const fullPath = path.join(GALLERY_PATH, item);
    return fs.statSync(fullPath).isDirectory();
  });

  if (folders.length === 0) {
    console.log('📭 No folders found.');
    console.log('💡 Create a folder (e.g., AsiaTrip, Pets, Miniatures) and add images!\n');
  } else {
    folders.forEach(folder => {
      const folderPath = path.join(GALLERY_PATH, folder);
      const imageCount = countImagesInFolder(folderPath);
      console.log(`   📁 ${folder} (${imageCount} images)`);
    });
    console.log('');
  }
}

// Main execution
async function main() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║     Gallery Image Scanner             ║');
  console.log('╚═══════════════════════════════════════╝\n');

  listGalleryFolders();
  await updateGalleryCounts();

  process.exit(0);
}

main();
