/**
 * Import LinkedIn Articles from OLD_SITE
 *
 * This script imports the 8 LinkedIn articles that were in the old site
 * into Firestore with all metadata and images.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Article data extracted from OLD_SITE/field-notes.html
const articles = [
  {
    title: "The Importance of Continuous Learning in Industry",
    url: "https://www.linkedin.com/pulse/importance-continuous-learning-industry-scott-kunian-8gsue/",
    description: "Exploring why continuous learning is essential in today's fast-paced tech industry and how to stay ahead of the curve.",
    imageUrl: "/images/articles/importanceofcontinuouslearning.png",
    publishedAt: new Date('2024-01-15'),
    source: "linkedin",
    isVisible: true,
  },
  {
    title: "Mastering Problem-Solving Skills: A Guide to Improvement",
    url: "https://www.linkedin.com/pulse/mastering-problem-solving-skills-guide-improvement-scott-kunian-b1hkf/",
    description: "Practical strategies for improving your problem-solving abilities and becoming a more effective engineer.",
    imageUrl: "/images/articles/theartofproblemsolving.png",
    publishedAt: new Date('2024-02-20'),
    source: "linkedin",
    isVisible: true,
  },
  {
    title: "Soft Skills: Beyond Technical Knowledge",
    url: "https://www.linkedin.com/pulse/soft-skills-beyond-technical-knowledge-scott-kunian-db8qe/",
    description: "Why soft skills matter as much as technical expertise in building a successful IT career.",
    imageUrl: "/images/articles/softskillsinit.png",
    publishedAt: new Date('2024-03-10'),
    source: "linkedin",
    isVisible: true,
  },
  {
    title: "Innovation: How to Foster a Culture of Creativity and Continuous Improvement",
    url: "https://www.linkedin.com/pulse/innovation-how-foster-culture-creativity-continuous-scott-kunian-hgece/",
    description: "Building teams and environments that encourage innovation and creative problem-solving.",
    imageUrl: "/images/articles/innovationinit.png",
    publishedAt: new Date('2024-04-15'),
    source: "linkedin",
    isVisible: true,
  },
  {
    title: "Hard Truth: Tech Networking in 2024 - Stop Collecting Certs, Start Building Connections",
    url: "https://www.linkedin.com/pulse/hard-truth-tech-networking-2024-stop-collecting-certs-scott-kunian-dlkre/",
    description: "Why professional networking is more valuable than certification collecting in modern tech careers.",
    imageUrl: "/images/articles/hardtruthabouttechnetworking.png",
    publishedAt: new Date('2024-06-01'),
    source: "linkedin",
    isVisible: true,
  },
  {
    title: "Tech's Next Wave: 2025's Reality Check",
    url: "https://www.linkedin.com/pulse/techs-next-wave-2025s-reality-check-scott-kunian-aj9se/",
    description: "Predictions and insights about technology trends shaping 2025 and beyond.",
    imageUrl: "/images/articles/techsnextwave.png",
    publishedAt: new Date('2024-09-15'),
    source: "linkedin",
    isVisible: true,
  },
  {
    title: "The Power of Networking: Building a Strong Professional Community",
    url: "https://www.linkedin.com/pulse/power-networking-building-strong-professional-community-scott-kunian-ouxge/",
    description: "How to build and maintain a professional network that supports your career growth.",
    imageUrl: "/images/articles/thepowerofnetworking.png",
    publishedAt: new Date('2024-10-20'),
    source: "linkedin",
    isVisible: true,
  },
  {
    title: "The Hybrid Engineer's Advantage: Why Infrastructure Knowledge Matters",
    url: "https://www.linkedin.com/pulse/hybrid-engineers-advantage-why-infrastructure-knowledge-scott-kunian-gztle/",
    description: "Why combining software development skills with infrastructure knowledge makes you a more valuable engineer.",
    imageUrl: "/images/articles/thehybridengineersadvantage.png",
    publishedAt: new Date('2024-11-10'),
    source: "linkedin",
    isVisible: true,
  }
];

async function importArticles() {
  console.log('📝 LinkedIn Article Import');
  console.log('==========================\n');

  try {
    let imported = 0;
    let skipped = 0;

    for (const article of articles) {
      // Check if article already exists
      const existingQuery = await db.collection('articles')
        .where('url', '==', article.url)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        console.log(`⏭️  Skipping (already exists): ${article.title}`);
        skipped++;
        continue;
      }

      // Add article to Firestore
      const articleData = {
        ...article,
        publishedAt: admin.firestore.Timestamp.fromDate(article.publishedAt),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('articles').add(articleData);
      console.log(`✅ Imported: ${article.title}`);
      imported++;
    }

    console.log('\n📊 Import Summary');
    console.log('=================');
    console.log(`✅ Imported: ${imported} articles`);
    console.log(`⏭️  Skipped: ${skipped} articles (already exist)`);
    console.log(`📝 Total: ${articles.length} articles processed`);
    console.log('\n✨ All articles are now visible on /articles page!');

  } catch (error) {
    console.error('❌ Error importing articles:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the import
importArticles();
