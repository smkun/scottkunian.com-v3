# LinkedIn Article Import Setup

**Purpose**: Automate importing LinkedIn articles to ScottKunian.com v4 via RapidAPI LinkedIn Data Scraper

**Status**: Implementation complete ✅

## 🎯 Overview

The LinkedIn import system fetches articles/posts from your LinkedIn profile and imports them into Firestore with engagement metrics (reactions, comments, shares). Articles require admin approval before appearing on the public site.

## 📋 Prerequisites

1. **Firebase Admin SDK** - Already configured ✅
2. **RapidAPI Account** - Required (see setup below)
3. **LinkedIn Data Scraper API Subscription** - Required (see pricing)

## 🚀 Quick Start

### Step 1: Sign Up for RapidAPI

1. Create account at [RapidAPI.com](https://rapidapi.com)
2. Browse to [LinkedIn Data Scraper API](https://rapidapi.com/search/linkedin)
3. Subscribe to a LinkedIn scraping API (recommendations below)

### Step 2: Get API Key

1. Navigate to your RapidAPI dashboard
2. Go to **My Apps** → **Default Application**
3. Copy your **API Key** (looks like: `1234567890abcdef...`)

### Step 3: Configure Environment

Add to `.env` file:

```bash
# RapidAPI LinkedIn Scraper
RAPIDAPI_KEY=your_api_key_here
LINKEDIN_PROFILE_URL=https://www.linkedin.com/in/scottkunian/
```

### Step 4: Test Import (Dry Run)

```bash
# Test without writing to Firestore
node scripts/linkedinImport.cjs --dry-run

# Test with specific profile
node scripts/linkedinImport.cjs --dry-run https://www.linkedin.com/in/username/
```

### Step 5: Run Manual Import

```bash
# Import articles to Firestore
node scripts/linkedinImport.cjs

# Or specify profile URL directly
node scripts/linkedinImport.cjs https://www.linkedin.com/in/scottkunian/
```

### Step 6: Approve Articles

1. Go to Admin Dashboard → Articles
2. Imported articles have `isVisible: false` (hidden by default)
3. Review each article and click **"Show"** to publish
4. Articles appear on public `/articles` page

## 💰 RapidAPI Pricing & Options

### Recommended APIs

**Option A: LinkedIn Data Scraper (RockAPIs)**
- **URL**: https://rapidapi.com/rockapis-rockapis-default/api/linkedin-data-api
- **Features**: Profile data, posts, articles, engagement metrics
- **Pricing**:
  - Free: 100 requests/month
  - Basic: $25/month for 20,000 requests
  - Pro: $50/month for 100,000 requests
- **Best For**: Personal sites, low volume

**Option B: Real-Time LinkedIn Scraper API**
- **Features**: Real-time data, company pages, job postings
- **Pricing**: Starting at $25/month
- **Best For**: Higher reliability needs

**Option C: AI-Powered LinkedIn Data Scraper**
- **Features**: Natural language queries, advanced filtering
- **Pricing**: Variable (check RapidAPI)
- **Best For**: Complex data extraction needs

### Cost Analysis for ScottKunian.com

**Expected Usage**:
- 1 import per day = 30 imports/month
- Well under free tier (100 requests/month)
- **Monthly Cost**: $0 (free tier sufficient)

**Recommended Plan**: Free tier to start, upgrade if needed

## 📊 Import Script Features

### Command Options

```bash
# Show help
node scripts/linkedinImport.cjs --help

# Dry run (preview without writing)
node scripts/linkedinImport.cjs --dry-run

# Manual import
node scripts/linkedinImport.cjs <profile-url>

# Scheduled mode (for cron jobs)
node scripts/linkedinImport.cjs --scheduled
```

### Data Imported

For each LinkedIn article/post:

```javascript
{
  title: "Article title",
  url: "https://linkedin.com/pulse/article-url",
  description: "Article description or post text",
  imageUrl: "Cover image URL",
  publishedAt: Timestamp,
  linkedinData: {
    reactionsCount: 150,    // Likes/reactions
    commentsCount: 25,      // Comments
    sharesCount: 10,        // Shares/reposts
    viewsCount: 5000,       // Views (if available)
    engagementRate: 3.7,    // Calculated percentage
  },
  source: "linkedin",
  isVisible: false,         // Requires admin approval
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### Duplicate Detection

- Checks existing articles by URL before importing
- Skips duplicates automatically
- Logs skipped articles for review

### Error Handling

- Validates RapidAPI key before import
- Handles API rate limits gracefully
- Provides detailed error messages
- Continues on individual article failures

## 🔄 Automation Setup (Optional)

### Option 1: Cron Job (Linux/macOS)

Add to crontab:

```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/project && node scripts/linkedinImport.cjs --scheduled >> logs/linkedin-import.log 2>&1
```

### Option 2: GitHub Actions Workflow

Create `.github/workflows/linkedin-import.yml`:

```yaml
name: LinkedIn Article Import

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:      # Manual trigger

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm install firebase-admin

      - name: Import LinkedIn Articles
        env:
          RAPIDAPI_KEY: ${{ secrets.RAPIDAPI_KEY }}
          LINKEDIN_PROFILE_URL: ${{ secrets.LINKEDIN_PROFILE_URL }}
        run: node scripts/linkedinImport.cjs --scheduled
```

### Option 3: Firebase Cloud Functions (Advanced)

Create `functions/src/linkedin-sync.ts`:

```typescript
import * as functions from 'firebase-functions';
import { syncLinkedInArticles } from './lib/linkedin';

export const scheduledLinkedInSync = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const profileUrl = functions.config().linkedin.profile_url;
    const apiKey = functions.config().rapidapi.key;

    await syncLinkedInArticles(profileUrl, apiKey);

    console.log('LinkedIn sync completed successfully');
  });
```

## 🔍 Troubleshooting

### Error: "RAPIDAPI_KEY environment variable not set"

**Solution**: Add API key to `.env` file or set environment variable:

```bash
export RAPIDAPI_KEY=your_api_key_here
node scripts/linkedinImport.cjs
```

### Error: "API returned status 401: Unauthorized"

**Causes**:
- Invalid API key
- Expired subscription
- Rate limit exceeded

**Solutions**:
1. Verify API key in RapidAPI dashboard
2. Check subscription status
3. Review API usage limits

### Error: "No posts found in API response"

**Causes**:
- LinkedIn profile is private
- API endpoint doesn't support posts
- Profile has no published articles

**Solutions**:
1. Ensure LinkedIn profile is public
2. Test with a different API endpoint
3. Try manual article entry instead

### Error: "Failed to parse API response"

**Causes**:
- API response format changed
- Network timeout
- Invalid JSON response

**Solutions**:
1. Check API documentation for format changes
2. Test API directly in RapidAPI dashboard
3. Contact RapidAPI support

## 📈 Monitoring & Analytics

### Import Logs

```bash
# View import history
cat logs/linkedin-import.log

# Monitor real-time import
tail -f logs/linkedin-import.log
```

### Success Metrics

- **Import Rate**: Articles imported vs skipped
- **Error Rate**: Failed imports
- **Engagement Data**: Average reactions, comments per article
- **Publication Rate**: Approved articles vs pending review

### Firestore Queries

```javascript
// Get all LinkedIn articles
const linkedInArticles = await db.collection('articles')
  .where('source', '==', 'linkedin')
  .orderBy('publishedAt', 'desc')
  .get();

// Get pending approval
const pendingArticles = await db.collection('articles')
  .where('isVisible', '==', false)
  .where('source', '==', 'linkedin')
  .get();

// Get engagement leaders
const topArticles = await db.collection('articles')
  .where('source', '==', 'linkedin')
  .orderBy('linkedinData.reactionsCount', 'desc')
  .limit(10)
  .get();
```

## 🛡️ Security Best Practices

1. **API Key Security**
   - Never commit `.env` file to git
   - Use GitHub Secrets for CI/CD
   - Rotate API keys periodically

2. **Rate Limiting**
   - Respect RapidAPI rate limits
   - Implement exponential backoff for retries
   - Monitor API usage dashboard

3. **Data Validation**
   - Validate all imported data
   - Sanitize HTML/URLs
   - Check for malicious content

4. **Admin Approval Workflow**
   - All imports default to `isVisible: false`
   - Require manual review before publishing
   - Check for inappropriate content

## 📚 Additional Resources

- **RapidAPI Documentation**: https://docs.rapidapi.com/
- **LinkedIn Scraping Guide**: https://scrapfly.io/blog/posts/how-to-scrape-linkedin-person-profile-company-job-data
- **Legal Considerations**: https://brightdata.com/blog/how-tos/linkedin-scraping-guide
- **Firebase Admin SDK**: https://firebase.google.com/docs/admin/setup

## 🎯 Next Steps

1. ✅ Script implementation complete
2. ⏳ Sign up for RapidAPI account
3. ⏳ Subscribe to LinkedIn Data Scraper API
4. ⏳ Test import with `--dry-run` flag
5. ⏳ Run manual import and approve articles
6. ⏳ Setup automation (cron or GitHub Actions)
7. ⏳ Monitor imports and adjust as needed

## 💡 Alternative: Manual Import

If RapidAPI doesn't meet your needs:

**Manual Workflow**:
1. Go to Admin Dashboard → Articles
2. Click **"+ New Article"**
3. Paste LinkedIn article URL
4. Fill in title, description, image
5. Optionally add LinkedIn engagement metrics manually
6. Save and publish

**Trade-offs**:
- ✅ No API costs
- ✅ Full control over data
- ❌ Time-consuming for many articles
- ❌ No automated engagement updates

---

**Status**: Ready for implementation
**Estimated Setup Time**: 30 minutes (with RapidAPI account)
**Maintenance**: Minimal (API provider handles LinkedIn changes)
