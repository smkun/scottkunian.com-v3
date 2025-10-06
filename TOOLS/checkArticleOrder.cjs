const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkArticleOrder() {
  console.log('📋 Checking Article Order in Firestore\n');

  try {
    // Query articles with isVisible=true, ordered by publishedAt DESC
    const articlesSnapshot = await db.collection('articles')
      .where('isVisible', '==', true)
      .orderBy('publishedAt', 'desc')
      .get();

    if (articlesSnapshot.empty) {
      console.log('❌ No visible articles found');
      process.exit(1);
    }

    console.log(`✅ Found ${articlesSnapshot.size} visible articles\n`);
    console.log('📅 Chronological Order (Newest → Oldest):\n');

    articlesSnapshot.docs.forEach((doc, index) => {
      const article = doc.data();
      const date = new Date(article.publishedAt.seconds * 1000);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      console.log(`${index + 1}. ${formattedDate} - ${article.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

checkArticleOrder();
