const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const project = {
  name: "32 Gamers",
  summary: "Gaming club website for weekly tabletop and digital gaming events",
  description: "Community gaming website for 32 Gamers club. Features event schedules, gaming resources, member profiles, and coordination tools for weekly gaming sessions including D&D, board games, and digital gaming.",
  technologies: ["HTML5", "CSS3", "JavaScript", "Web Design"],
  liveUrl: "https://www.32gamers.com",
  imageUrl: "/images/projects/32gamers.jpg",
  completedAt: new Date('2024-01-01'),
  isVisible: true,
  isPinned: true,
};

async function add32Gamers() {
  console.log('🎮 Adding 32 Gamers Project\n');

  try {
    // Check if project already exists
    const existingQuery = await db.collection('projects')
      .where('name', '==', project.name)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      console.log(`⏭️  Project already exists: ${project.name}`);
      process.exit(0);
    }

    // Add project to Firestore
    const projectData = {
      ...project,
      completedAt: admin.firestore.Timestamp.fromDate(project.completedAt),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('projects').add(projectData);
    console.log(`✅ Added: ${project.name}`);
    console.log(`   ID: ${docRef.id}`);
    console.log(`   Live URL: ${project.liveUrl}`);
    console.log(`   Image needed: ${project.imageUrl}`);

  } catch (error) {
    console.error('❌ Error adding project:', error);
    process.exit(1);
  }

  process.exit(0);
}

add32Gamers();
