/**
 * Import Old Field Notes as Nybles
 *
 * Imports the 5 legacy field notes from OLD_SITE into Firestore as Nybles
 *
 * Run: node scripts/importOldNybles.cjs
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');

if (!require('fs').existsSync(serviceAccountPath)) {
  console.error('❌ Error: firebase-service-account.json not found!');
  console.error('📋 Please download your service account key from Firebase Console');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// The 5 old field notes from OLD_SITE
const oldNybles = [
  {
    title: "Python: My Silver Lining After Layoff",
    content: `Life took an unexpected turn when I found myself laid off. But instead of dwelling on the loss, I dove headfirst into learning Python. This marked the beginning of an exciting new chapter filled with coding adventures, problem-solving, and personal growth.`,
    publishedDate: new Date('2024-08-01'),
    tags: ['python', 'career', 'learning'],
    mood: 'positive'
  },
  {
    title: "The Evolution of My Gaming Life 🎮",
    content: `From rolling dice in D&D sessions back in 1977 to co-owning my own game store, my journey through the world of games has been nothing short of legendary. Games have shaped not just my leisure time but also my professional path.`,
    publishedDate: new Date('2024-06-01'),
    tags: ['gaming', 'dnd', 'personal'],
    mood: 'positive'
  },
  {
    title: "Mastering the Art of 3D Printing for Tabletop Games",
    content: `With six 3D printers in my arsenal, I've crafted everything from detailed miniatures to entire dungeon terrains. Here's how 3D printing has revolutionized my tabletop RPG experiences and tips for beginners looking to start their own printing journey.`,
    publishedDate: new Date('2024-03-01'),
    tags: ['3d-printing', 'gaming', 'hobby'],
    mood: 'positive'
  },
  {
    title: "Rolling the Dice: Tabletop Adventures 🎲",
    content: `My love for tabletop gaming transcends pixels and screens. Every week, I invite my friends over for epic adventures. The 3rd floor gaming table transforms into a battleground, and dice become the arbiters of fate.`,
    publishedDate: new Date('2024-01-15'),
    tags: ['gaming', 'dnd', 'social'],
    mood: 'positive'
  },
  {
    title: "Furry Companions: Zula, Peanut, and Daphney 🐾",
    content: `My home isn't complete without my furry companions. Zula, the majestic Rottweiler, guards the house with unwavering loyalty. Peanut, the fluffy white cat, observes the world with curiosity. Daphney, the elegant Russian Blue, demands attention with her regal meows.`,
    publishedDate: new Date('2023-12-01'),
    tags: ['pets', 'personal', 'family'],
    mood: 'positive'
  }
];

async function importNybles() {
  console.log('🔄 Starting Nybles import from OLD_SITE\n');
  console.log('=' .repeat(60));

  let imported = 0;
  let errors = 0;

  for (const nyble of oldNybles) {
    try {
      const nybleData = {
        content: `**${nyble.title}**\n\n${nyble.content}`,
        tags: nyble.tags,
        type: 'quick',
        mood: nyble.mood,
        isPublic: true,
        createdAt: admin.firestore.Timestamp.fromDate(nyble.publishedDate),
        updatedAt: admin.firestore.Timestamp.fromDate(nyble.publishedDate),
      };

      const docRef = await db.collection('notes').add(nybleData);
      console.log(`✅ Imported: ${nyble.title}`);
      console.log(`   ID: ${docRef.id}`);
      console.log(`   Tags: ${nyble.tags.join(', ')}`);
      console.log(`   Date: ${nyble.publishedDate.toLocaleDateString()}\n`);
      imported++;
    } catch (error) {
      console.error(`❌ Failed to import: ${nyble.title}`);
      console.error(`   Error: ${error.message}\n`);
      errors++;
    }
  }

  console.log('=' .repeat(60));
  console.log('✅ Import Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Successfully imported: ${imported}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${oldNybles.length}`);
  console.log('=' .repeat(60));
}

// Run import
importNybles()
  .then(() => {
    console.log('\n🎉 All done! Your old field notes are now Nybles.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
