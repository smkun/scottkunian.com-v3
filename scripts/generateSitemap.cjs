/**
 * Sitemap Generator for ScottKunian.com
 *
 * Generates sitemap.xml for SEO optimization
 * Run with: node scripts/generateSitemap.js
 */

const fs = require('fs');
const path = require('path');

// Site configuration
const SITE_URL = 'https://scottkunian.com';
const OUTPUT_PATH = path.join(__dirname, '../dist/sitemap.xml');

// Static routes
const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'daily', priority: '0.9' },
  { path: '/projects', changefreq: 'weekly', priority: '0.9' },
  { path: '/articles', changefreq: 'weekly', priority: '0.8' },
  { path: '/notes', changefreq: 'daily', priority: '0.7' },
  { path: '/contact', changefreq: 'yearly', priority: '0.6' },
];

/**
 * Format date to W3C Datetime format (ISO 8601)
 */
function formatDate(date) {
  return date.toISOString();
}

/**
 * Generate URL entry for sitemap
 */
function generateUrlEntry(url, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate sitemap.xml content
 */
function generateSitemap(urls) {
  const urlEntries = urls.map(url =>
    generateUrlEntry(url.loc, url.lastmod, url.changefreq, url.priority)
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Fetch dynamic content from Firestore (when available)
 * For now, returns empty arrays - will be populated once admin access is set up
 */
async function fetchDynamicContent() {
  // TODO: Integrate with Firestore once admin claim is set
  // This will fetch published posts, projects, articles, and notes

  console.log('⚠️  Note: Dynamic content fetching requires Firestore access');
  console.log('   Run this script after admin claim is set for complete sitemap');

  return {
    posts: [],
    projects: [],
    articles: [],
    notes: []
  };
}

/**
 * Main sitemap generation function
 */
async function main() {
  console.log('📄 Generating sitemap.xml...\n');

  const now = formatDate(new Date());
  const urls = [];

  // Add static routes
  console.log('Adding static routes...');
  staticRoutes.forEach(route => {
    urls.push({
      loc: `${SITE_URL}${route.path}`,
      lastmod: now,
      changefreq: route.changefreq,
      priority: route.priority
    });
    console.log(`  ✓ ${route.path}`);
  });

  // Fetch dynamic content
  console.log('\nFetching dynamic content...');
  const { posts, projects, articles, notes } = await fetchDynamicContent();

  // Add blog posts
  if (posts.length > 0) {
    console.log(`\nAdding ${posts.length} blog posts...`);
    posts.forEach(post => {
      urls.push({
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod: formatDate(post.updatedAt || post.createdAt),
        changefreq: 'monthly',
        priority: '0.7'
      });
    });
  }

  // Add projects
  if (projects.length > 0) {
    console.log(`Adding ${projects.length} projects...`);
    projects.forEach(project => {
      const slug = project.name.toLowerCase().replace(/\s+/g, '-');
      urls.push({
        loc: `${SITE_URL}/projects/${project.id}`,
        lastmod: formatDate(project.updatedAt || project.createdAt),
        changefreq: 'monthly',
        priority: '0.6'
      });
    });
  }

  // Add articles
  if (articles.length > 0) {
    console.log(`Adding ${articles.length} articles...`);
    articles.forEach(article => {
      urls.push({
        loc: article.url, // External LinkedIn URL
        lastmod: formatDate(article.createdAt),
        changefreq: 'yearly',
        priority: '0.5'
      });
    });
  }

  // Generate sitemap XML
  console.log('\n📝 Generating sitemap XML...');
  const sitemapXml = generateSitemap(urls);

  // Ensure dist directory exists
  const distDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(distDir)) {
    console.log(`Creating dist directory: ${distDir}`);
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write sitemap to file
  fs.writeFileSync(OUTPUT_PATH, sitemapXml, 'utf8');

  console.log('\n✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${OUTPUT_PATH}`);
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log(`   - Static routes: ${staticRoutes.length}`);
  console.log(`   - Blog posts: ${posts.length}`);
  console.log(`   - Projects: ${projects.length}`);
  console.log(`   - Articles: ${articles.length}`);

  console.log('\n💡 Next steps:');
  console.log('   1. Deploy sitemap.xml with your production build');
  console.log('   2. Submit to Google Search Console: https://search.google.com/search-console');
  console.log('   3. Add sitemap URL to robots.txt');
  console.log(`   4. Sitemap URL: ${SITE_URL}/sitemap.xml`);
}

// Run generator
main().catch(error => {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
});
