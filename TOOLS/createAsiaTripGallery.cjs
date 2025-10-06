#!/usr/bin/env node

/**
 * Create Asia Trip Gallery Category
 *
 * Creates the Asia Trip gallery category in Firestore with metadata
 * from the existing AsiaTrip folder structure.
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

async function createAsiaTripGallery() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   Create Asia Trip Gallery Category   ║');
  console.log('╚═══════════════════════════════════════╝\n');

  try {
    // Check if category already exists
    const existing = await db.collection('galleries')
      .where('slug', '==', 'asia-trip')
      .get();

    if (!existing.empty) {
      console.log('⚠️  Asia Trip gallery already exists!');
      console.log('   ID:', existing.docs[0].id);
      console.log('   Updating image count...\n');

      // Update the existing category
      await db.collection('galleries').doc(existing.docs[0].id).update({
        imageCount: 535,
        updatedAt: admin.firestore.Timestamp.now()
      });

      console.log('✅ Updated image count to 535\n');
      return;
    }

    // Create new category
    const categoryData = {
      name: 'Asia Trip',
      slug: 'asia-trip',
      folderPath: 'AsiaTrip',
      description: '2025 journey through China and Japan - 38 locations, 535 photos capturing the essence of East Asian culture, architecture, and daily life.',
      coverImage: '/images/gallery/AsiaTrip/202503_AirChina/FUNT0733.webp',
      imageCount: 535,
      isVisible: true,
      sortOrder: 0,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };

    const docRef = await db.collection('galleries').add(categoryData);

    console.log('✅ Asia Trip gallery created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('   ID:', docRef.id);
    console.log('   Name:', categoryData.name);
    console.log('   Slug:', categoryData.slug);
    console.log('   Folder:', categoryData.folderPath);
    console.log('   Images:', categoryData.imageCount);
    console.log('   Locations: 38 folders');
    console.log('═══════════════════════════════════════\n');

    console.log('🌐 View your gallery at:');
    console.log('   http://localhost:3000/gallery/asia-trip\n');

  } catch (error) {
    console.error('❌ Error creating gallery:', error);
    process.exit(1);
  }

  process.exit(0);
}

createAsiaTripGallery();
