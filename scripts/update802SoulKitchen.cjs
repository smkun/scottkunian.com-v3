const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function update802SoulKitchen() {
  console.log('🍽️  Updating 802 Soul Kitchen Tech Stack\n');

  try {
    // Find the 802 Soul Kitchen project
    const projectQuery = await db.collection('projects')
      .where('name', '==', '802 Soul Kitchen')
      .limit(1)
      .get();

    if (projectQuery.empty) {
      console.log('❌ 802 Soul Kitchen project not found');
      process.exit(1);
    }

    const docRef = projectQuery.docs[0].ref;

    // Update with correct technologies
    await docRef.update({
      technologies: ["Astro", "Tailwind CSS", "JavaScript", "TypeScript"],
      description: "Modern restaurant website built with Astro and Tailwind CSS. Features fast static site generation, responsive design, menu displays, and optimized performance for excellent user experience.",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Updated 802 Soul Kitchen');
    console.log('   New technologies: Astro, Tailwind CSS, JavaScript, TypeScript');
    console.log('   ID:', projectQuery.docs[0].id);

  } catch (error) {
    console.error('❌ Error updating project:', error);
    process.exit(1);
  }

  process.exit(0);
}

update802SoulKitchen();
