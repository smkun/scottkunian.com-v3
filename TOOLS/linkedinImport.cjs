/**
 * LinkedIn Article Import Script
 *
 * Imports LinkedIn articles via RapidAPI LinkedIn Data Scraper
 * Can be run manually or as a scheduled task
 *
 * Usage:
 *   node scripts/linkedinImport.cjs <linkedin-profile-url>
 *   node scripts/linkedinImport.cjs --scheduled (for cron jobs)
 */

const admin = require('firebase-admin');
const https = require('https');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const LINKEDIN_PROFILE_URL = process.env.LINKEDIN_PROFILE_URL || 'https://www.linkedin.com/in/scottkunian/';

/**
 * Fetch LinkedIn profile data via RapidAPI
 */
async function fetchLinkedInData(profileUrl) {
  const apiUrl = 'linkedin-data-api.p.rapidapi.com';
  const path = '/get-profile-posts';

  const options = {
    method: 'GET',
    hostname: apiUrl,
    port: null,
    path: `${path}?url=${encodeURIComponent(profileUrl)}`,
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': apiUrl
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();

        try {
          const data = JSON.parse(body);

          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`API returned status ${res.statusCode}: ${body}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`HTTP request failed: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Parse LinkedIn article data into Firestore Article format
 */
function parseLinkedInArticle(post) {
  // Extract article URL (LinkedIn post or external article)
  const articleUrl = post.article_url || post.post_url || post.url || '';

  // Determine if this is a LinkedIn article or external
  const isLinkedInArticle = articleUrl.includes('linkedin.com/pulse/');

  return {
    title: post.title || post.text?.substring(0, 100) || 'Untitled Article',
    url: articleUrl,
    description: post.description || post.text || '',
    imageUrl: post.image || post.media?.[0]?.url || null,
    publishedAt: post.published_date ? admin.firestore.Timestamp.fromDate(new Date(post.published_date)) : admin.firestore.Timestamp.now(),
    linkedinData: {
      reactionsCount: post.reactions || post.likes || 0,
      commentsCount: post.comments || 0,
      sharesCount: post.shares || post.reposts || 0,
      viewsCount: post.views || 0,
      engagementRate: calculateEngagementRate(post),
    },
    source: 'linkedin',
    isVisible: false, // Requires admin approval
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };
}

/**
 * Calculate engagement rate from LinkedIn metrics
 */
function calculateEngagementRate(post) {
  const reactions = post.reactions || post.likes || 0;
  const comments = post.comments || 0;
  const shares = post.shares || post.reposts || 0;
  const views = post.views || 0;

  if (views === 0) return 0;

  const totalEngagement = reactions + comments + shares;
  return Math.round((totalEngagement / views) * 100 * 100) / 100; // Round to 2 decimals
}

/**
 * Check if article already exists in Firestore (by URL)
 */
async function articleExists(url) {
  const snapshot = await db.collection('articles')
    .where('url', '==', url)
    .limit(1)
    .get();

  return !snapshot.empty;
}

/**
 * Import LinkedIn articles to Firestore
 */
async function importLinkedInArticles(profileUrl, dryRun = false) {
  console.log(`\n📥 Importing LinkedIn articles from: ${profileUrl}`);

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No data will be written\n');
  }

  if (!RAPIDAPI_KEY) {
    console.error('❌ Error: RAPIDAPI_KEY environment variable not set');
    console.error('   Please set RAPIDAPI_KEY in your environment or .env file');
    process.exit(1);
  }

  try {
    // Fetch LinkedIn data
    console.log('🔍 Fetching LinkedIn profile data...');
    const data = await fetchLinkedInData(profileUrl);

    if (!data.posts || !Array.isArray(data.posts)) {
      console.error('❌ No posts found in API response');
      console.error('   Response structure:', JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log(`   Found ${data.posts.length} posts\n`);

    // Filter for articles (posts with URLs, not just text updates)
    const articles = data.posts.filter(post => {
      const hasUrl = post.article_url || post.post_url || post.url;
      const hasTitle = post.title || (post.text && post.text.length > 50);
      return hasUrl && hasTitle;
    });

    console.log(`   Filtered to ${articles.length} articles\n`);

    // Import articles
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const post of articles) {
      try {
        const articleData = parseLinkedInArticle(post);

        // Check if article already exists
        const exists = await articleExists(articleData.url);

        if (exists) {
          console.log(`⏭️  Skipped (already exists): ${articleData.title.substring(0, 60)}...`);
          skippedCount++;
          continue;
        }

        if (!dryRun) {
          await db.collection('articles').add(articleData);
        }

        console.log(`✅ Imported: ${articleData.title.substring(0, 60)}...`);
        console.log(`   URL: ${articleData.url}`);
        console.log(`   Engagement: ${articleData.linkedinData.reactionsCount} reactions, ${articleData.linkedinData.commentsCount} comments\n`);

        importedCount++;
      } catch (error) {
        console.error(`❌ Error importing article: ${error.message}`);
        errorCount++;
      }
    }

    // Summary
    console.log('\n📊 Import Summary:');
    console.log('==================');
    console.log(`Total posts found: ${data.posts.length}`);
    console.log(`Articles identified: ${articles.length}`);
    console.log(`✅ Imported: ${importedCount}`);
    console.log(`⏭️  Skipped (duplicates): ${skippedCount}`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount}`);
    }

    if (dryRun) {
      console.log('\n⚠️  This was a DRY RUN. No data was written to Firestore.');
      console.log('   Run without --dry-run flag to perform actual import.');
    } else {
      console.log('\n✅ Import completed!');
      console.log('   Articles are set to isVisible=false and require admin approval.');
    }

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);

    if (error.message.includes('API returned status')) {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   - Verify your RapidAPI key is correct');
      console.error('   - Check your RapidAPI subscription is active');
      console.error('   - Ensure the LinkedIn profile URL is public');
      console.error('   - Check RapidAPI dashboard for rate limits');
    }

    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Help command
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
LinkedIn Article Import Script

Usage:
  node scripts/linkedinImport.cjs [options] [profile-url]

Options:
  --dry-run         Preview import without writing to Firestore
  --scheduled       Run in scheduled mode (uses LINKEDIN_PROFILE_URL env var)
  --help, -h        Show this help message

Examples:
  node scripts/linkedinImport.cjs https://www.linkedin.com/in/username/
  node scripts/linkedinImport.cjs --dry-run
  LINKEDIN_PROFILE_URL=https://... node scripts/linkedinImport.cjs --scheduled

Environment Variables:
  RAPIDAPI_KEY              Required: Your RapidAPI API key
  LINKEDIN_PROFILE_URL      LinkedIn profile URL (for --scheduled mode)
    `);
    process.exit(0);
  }

  // Determine mode and profile URL
  const dryRun = args.includes('--dry-run');
  const scheduled = args.includes('--scheduled');

  let profileUrl;
  if (scheduled) {
    profileUrl = LINKEDIN_PROFILE_URL;
  } else {
    profileUrl = args.find(arg => !arg.startsWith('--')) || LINKEDIN_PROFILE_URL;
  }

  if (!profileUrl) {
    console.error('❌ Error: No LinkedIn profile URL provided');
    console.error('   Usage: node scripts/linkedinImport.cjs <profile-url>');
    console.error('   Or set LINKEDIN_PROFILE_URL environment variable');
    process.exit(1);
  }

  console.log('🔗 LinkedIn Article Import Tool\n');
  console.log(`Profile URL: ${profileUrl}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : scheduled ? 'SCHEDULED' : 'MANUAL'}`);

  await importLinkedInArticles(profileUrl, dryRun);
}

// Run import
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
