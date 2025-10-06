const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Live game/app projects from OLD_SITE/apps.html
const liveProjects = [
  {
    name: "Freight Rate Calculator",
    summary: "Interactive freight shipping rate calculator",
    description: "Calculate freight shipping rates with an easy-to-use interface. Supports multiple shipping methods and provides instant rate quotes.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "/games/ffc.html",
    imageUrl: "/images/projects/freight-calculator.jpg",
    completedAt: new Date('2024-07-01'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Natural Language to JSON Converter",
    summary: "Convert natural language queries into structured JSON",
    description: "Intelligent tool that converts natural language input into properly formatted JSON objects. Useful for API development and data structure design.",
    technologies: ["JavaScript", "HTML5", "NLP"],
    liveUrl: "/games/prompt.html",
    imageUrl: "/images/projects/json-converter.jpg",
    completedAt: new Date('2024-07-01'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Memory Game",
    summary: "Classic memory matching card game",
    description: "Test your memory with this engaging card matching game. Flip cards to find matching pairs and complete the board in the fewest moves possible.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "/games/memory.html",
    imageUrl: "/images/projects/memory-game.jpg",
    completedAt: new Date('2024-06-15'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Tic Tac Toe",
    summary: "Classic two-player tic tac toe game",
    description: "Play the timeless game of tic tac toe. Features clean interface, win detection, and score tracking. Perfect for quick gaming sessions.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "/games/ttt.html",
    imageUrl: "/images/projects/tictactoe.jpg",
    completedAt: new Date('2024-06-01'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Number Guessing Game",
    summary: "Guess the secret number challenge",
    description: "A fun number guessing game where you try to guess the secret number with hints. Features difficulty levels and score tracking.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "/games/number.html",
    imageUrl: "/images/projects/number-game.jpg",
    completedAt: new Date('2024-05-20'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Lapis Papyrus Scalpellus",
    summary: "Rock, paper, scissors game with a Latin twist",
    description: "The classic rock-paper-scissors game with an elegant Latin naming convention. Play against the computer with smart AI opponent.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "/games/lps.html",
    imageUrl: "/images/projects/rock-paper-scissors.jpg",
    completedAt: new Date('2024-05-15'),
    isVisible: true,
    isPinned: false,
  },
  {
    name: "Eldran the Cardweaver",
    summary: "Interactive magic card trick experience",
    description: "Experience an interactive magic card trick with Eldran the Cardweaver. A digital implementation of a classic mentalism effect with engaging storytelling.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    liveUrl: "/games/magician.html",
    imageUrl: "/images/projects/cardweaver.jpg",
    completedAt: new Date('2024-05-01'),
    isVisible: true,
    isPinned: false,
  },
];

async function importLiveGames() {
  console.log('🎮 Live Games/Apps Import\n');

  try {
    let imported = 0;
    let skipped = 0;

    for (const project of liveProjects) {
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

    console.log(`\n✅ Imported: ${imported} live games/apps`);
    console.log(`⏭️  Skipped: ${skipped} live games/apps`);

  } catch (error) {
    console.error('❌ Error importing live games:', error);
    process.exit(1);
  }

  process.exit(0);
}

importLiveGames();
