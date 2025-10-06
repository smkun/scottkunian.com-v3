/**
 * RSS Feed Generator for ScottKunian.com Blog
 *
 * Generates RSS 2.0 feed for blog posts
 * Run with: node scripts/generateRSS.cjs
 */

const fs = require('fs');
const path = require('path');

// Site configuration
const SITE_CONFIG = {
  title: 'Scott Kunian - Blog',
  description: 'Software engineering insights, tutorials, and technical articles',
  url: 'https://scottkunian.com',
  feedUrl: 'https://scottkunian.com/rss.xml',
  language: 'en-us',
  copyright: `Copyright ${new Date().getFullYear()} Scott Kunian`,
  author: 'Scott Kunian',
  email: 'scottkunian@gmail.com',
  categories: ['Technology', 'Software Engineering', 'Web Development'],
};

const OUTPUT_PATH = path.join(__dirname, '../dist/rss.xml');

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Format date to RFC 822 format (required by RSS 2.0)
 */
function formatRFC822(date) {
  return date.toUTCString();
}

/**
 * Generate RSS item for a blog post
 */
function generateRSSItem(post) {
  const url = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const pubDate = formatRFC822(post.createdAt || new Date());

  // Extract categories from tags
  const categories = post.tags || [];

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${SITE_CONFIG.email} (${SITE_CONFIG.author})</author>
      <description><![CDATA[${post.summary || ''}]]></description>
${categories.map(cat => `      <category>${escapeXml(cat)}</category>`).join('\n')}
    </item>`;
}

/**
 * Generate RSS feed XML
 */
function generateRSSFeed(posts) {
  const buildDate = formatRFC822(new Date());
  const lastBuildDate = posts.length > 0
    ? formatRFC822(posts[0].createdAt || new Date())
    : buildDate;

  const items = posts.map(generateRSSItem).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.title)}</title>
    <link>${SITE_CONFIG.url}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>${SITE_CONFIG.language}</language>
    <copyright>${escapeXml(SITE_CONFIG.copyright)}</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <atom:link href="${SITE_CONFIG.feedUrl}" rel="self" type="application/rss+xml" />
${SITE_CONFIG.categories.map(cat => `    <category>${escapeXml(cat)}</category>`).join('\n')}
${items}
  </channel>
</rss>`;
}

/**
 * Fetch published blog posts from Firestore (when available)
 */
async function fetchBlogPosts() {
  // TODO: Integrate with Firestore once admin claim is set
  // This will fetch all published blog posts sorted by date

  console.log('⚠️  Note: Blog post fetching requires Firestore access');
  console.log('   Run this script after admin claim is set for complete RSS feed');

  // Sample post structure for reference
  return [
    // {
    //   title: 'Sample Blog Post',
    //   slug: 'sample-blog-post',
    //   summary: 'This is a sample post description',
    //   tags: ['javascript', 'react'],
    //   createdAt: new Date(),
    //   published: true
    // }
  ];
}

/**
 * Main RSS generation function
 */
async function main() {
  console.log('📡 Generating RSS feed...\n');

  // Fetch published posts
  console.log('Fetching published blog posts...');
  const posts = await fetchBlogPosts();

  if (posts.length === 0) {
    console.log('⚠️  No published posts found');
    console.log('   Creating empty RSS feed template\n');
  } else {
    console.log(`✓ Found ${posts.length} published posts\n`);
  }

  // Generate RSS XML
  console.log('📝 Generating RSS XML...');
  const rssXml = generateRSSFeed(posts);

  // Ensure dist directory exists
  const distDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(distDir)) {
    console.log(`Creating dist directory: ${distDir}`);
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write RSS to file
  fs.writeFileSync(OUTPUT_PATH, rssXml, 'utf8');

  console.log('\n✅ RSS feed generated successfully!');
  console.log(`📍 Location: ${OUTPUT_PATH}`);
  console.log(`📊 Total posts: ${posts.length}`);
  console.log(`🔗 Feed URL: ${SITE_CONFIG.feedUrl}`);

  console.log('\n💡 Next steps:');
  console.log('   1. Deploy rss.xml with your production build');
  console.log('   2. Add RSS link to your blog page header');
  console.log('   3. Add to <head>:');
  console.log('      <link rel="alternate" type="application/rss+xml"');
  console.log('            title="Scott Kunian - Blog"');
  console.log('            href="/rss.xml" />');
  console.log('   4. Test feed: https://validator.w3.org/feed/');
}

// Run generator
main().catch(error => {
  console.error('❌ Error generating RSS feed:', error);
  process.exit(1);
});
