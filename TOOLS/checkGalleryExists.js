#!/usr/bin/env node

/**
 * Check if Asia Trip gallery exists in Firestore
 * Uses client SDK to verify from user perspective
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkGallery() {
  console.log('\n╔══════════════════════════════════╗');
  console.log('║  Check Asia Trip Gallery Status  ║');
  console.log('╚══════════════════════════════════╝\n');

  try {
    const galleriesRef = collection(db, 'galleries');
    const q = query(galleriesRef, where('slug', '==', 'asia-trip'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('❌ Asia Trip gallery NOT FOUND in Firestore\n');
      console.log('The gallery needs to be created. You can:');
      console.log('1. Use admin panel at /admin/gallery');
      console.log('2. Or manually add document to Firestore Console\n');
      return false;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    console.log('✅ Asia Trip gallery EXISTS!\n');
    console.log('═══════════════════════════════════');
    console.log('   ID:', doc.id);
    console.log('   Name:', data.name);
    console.log('   Slug:', data.slug);
    console.log('   Folder:', data.folderPath);
    console.log('   Visible:', data.isVisible);
    console.log('   Images:', data.imageCount || 'N/A');
    console.log('═══════════════════════════════════\n');

    return true;
  } catch (error) {
    console.error('❌ Error checking gallery:', error.message);
    return false;
  }
}

checkGallery().then(() => process.exit(0));
