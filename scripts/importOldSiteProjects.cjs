const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Project data extracted from OLD_SITE/apps.html
const projects = [
  {
    name: "Alien Blaster Project",
    summary: "Classic arcade-style space shooter game",
    description: "A retro-inspired alien blaster game built with modern web technologies. Features smooth animations, challenging gameplay, and classic arcade aesthetics.",
    technologies: ["JavaScript", "HTML5", "Canvas"],
    githubUrl: "https://github.com/smkun/alien-blaster-project.git",
    imageUrl: "/images/projects/ab.jpg",
    completedAt: new Date('2024-06-01'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Hangman",
    summary: "Classic word guessing game built with Python",
    description: "Traditional hangman game with a clean interface. Test your vocabulary and deduction skills in this timeless word puzzle.",
    technologies: ["Python"],
    githubUrl: "https://github.com/smkun/Hangman-Python.git",
    imageUrl: "/images/projects/hm.jpg",
    completedAt: new Date('2024-05-15'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "SuperHero",
    summary: "Superhero database and information app",
    description: "Browse and explore a comprehensive database of superheroes. Features detailed character information, powers, and statistics.",
    technologies: ["JavaScript", "React", "API"],
    githubUrl: "https://github.com/smkun/SuperHero.git",
    imageUrl: "/images/projects/sh.jpg",
    completedAt: new Date('2024-04-20'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Medic Elite",
    summary: "Healthcare company management system",
    description: "Full-featured company management lab project for healthcare operations. Demonstrates enterprise-level application architecture and data management.",
    technologies: ["JavaScript", "React", "Node.js"],
    githubUrl: "https://github.com/smkun/company-lab.git",
    imageUrl: "/images/projects/me.jpg",
    completedAt: new Date('2024-03-10'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Calculator",
    summary: "Full-featured calculator application",
    description: "A modern calculator with standard and advanced mathematical operations. Clean interface with keyboard support and calculation history.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    githubUrl: "https://github.com/smkun/Calculator.git",
    imageUrl: "/images/projects/calc.jpg",
    completedAt: new Date('2024-02-01'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Star Wars DB",
    summary: "Star Wars universe database explorer",
    description: "Interactive database of Star Wars characters, planets, and starships. Demonstrates API integration and React data fetching patterns.",
    technologies: ["JavaScript", "React", "API"],
    githubUrl: "https://github.com/smkun/fetching-data-in-react-lab.git",
    imageUrl: "/images/projects/swdb.jpg",
    completedAt: new Date('2024-01-15'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "802 Soul Kitchen",
    summary: "Restaurant website design and development",
    description: "Full website design and development for 802 Soul Kitchen restaurant. Features menu displays, online ordering integration, and responsive design.",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "https://www.802soulkitchen.com",
    imageUrl: "/images/projects/802soulkitchen.jpg",
    completedAt: new Date('2023-11-01'),
    isVisible: true,
    isPinned: true,
  },
];

async function importProjects() {
  console.log('🚀 OLD_SITE Projects Import\n');

  try {
    let imported = 0;
    let skipped = 0;

    for (const project of projects) {
      // Check if project already exists (by name)
      const existingQuery = await db.collection('projects')
        .where('name', '==', project.name)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        console.log(`⏭️  Skipping (already exists): ${project.name}`);
        skipped++;
        continue;
      }

      // Add project to Firestore
      const projectData = {
        ...project,
        completedAt: admin.firestore.Timestamp.fromDate(project.completedAt),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('projects').add(projectData);
      console.log(`✅ Imported: ${project.name}`);
      imported++;
    }

    console.log(`\n✅ Imported: ${imported} projects`);
    console.log(`⏭️  Skipped: ${skipped} projects`);

  } catch (error) {
    console.error('❌ Error importing projects:', error);
    process.exit(1);
  }

  process.exit(0);
}

importProjects();
