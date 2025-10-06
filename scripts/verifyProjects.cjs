const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function verifyProjects() {
  console.log('🔍 Verifying Projects in Firestore\n');

  try {
    const projectsSnapshot = await db.collection('projects')
      .orderBy('completedAt', 'desc')
      .get();

    if (projectsSnapshot.empty) {
      console.log('❌ No projects found');
      process.exit(1);
    }

    console.log(`📊 Total projects in Firestore: ${projectsSnapshot.size}\n`);

    projectsSnapshot.docs.forEach((doc) => {
      const project = doc.data();
      const date = new Date(project.completedAt.seconds * 1000);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });

      console.log(`✅ ${project.name}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Completed: ${formattedDate}`);
      console.log(`   Visible: ${project.isVisible}`);
      console.log(`   Pinned: ${project.isPinned}`);
      console.log(`   Technologies: ${project.technologies.join(', ')}`);
      if (project.githubUrl) console.log(`   GitHub: ${project.githubUrl}`);
      if (project.liveUrl) console.log(`   Live: ${project.liveUrl}`);
      console.log(`   Image: ${project.imageUrl}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

verifyProjects();
