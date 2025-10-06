# Quick Start Guide - ScottKunian.com v4

**Project Status**: 63% Complete | **Production Readiness**: 82%

## 🚀 Getting Started

### Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Server runs at: http://localhost:3003

# Build for production
npm run build

# Preview production build
npm run preview
```

### Firebase Project
- **Project ID**: `scottkunian-website`
- **Console**: https://console.firebase.google.com/project/scottkunian-website
- **Environment**: Production credentials in `.env`

## ⚡ Critical Next Step (BLOCKING)

### Admin Panel Access Setup

**You must complete this to access `/admin` routes:**

1. **Download Service Account Key**
   - Visit: [Service Accounts](https://console.firebase.google.com/project/scottkunian-website/settings/serviceaccounts/adminsdk)
   - Click "Generate New Private Key"
   - Save as `firebase-service-account.json` in project root

2. **Install Firebase Admin SDK**
   ```bash
   npm install firebase-admin
   ```

3. **Run Setup Script**
   ```bash
   node scripts/setAdminClaim.js
   ```

4. **Refresh Token**
   - Sign out from the app
   - Sign in again with Google

**Detailed Instructions**: `docs/ADMIN_SETUP.md`

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Button, Card, Input, etc.
│   ├── auth/         # ProtectedRoute, AdminRoute
│   └── accessibility/ # SkipNav, LiveRegion
├── pages/            # Route components
│   ├── Home/
│   ├── Blog/
│   ├── Projects/
│   ├── Articles/
│   └── Login/
├── admin/            # Admin panel components
│   ├── PostsManager.tsx
│   ├── ProjectsManager.tsx
│   ├── ArticlesManager.tsx
│   └── NotesManager.tsx
├── lib/              # Core libraries
│   ├── firebase.ts   # Firebase initialization
│   ├── auth.ts       # Authentication helpers
│   ├── firestore.ts  # Database operations
│   ├── storage.ts    # File upload
│   ├── github.ts     # GitHub API integration
│   └── analytics.ts  # GA4 tracking
└── hooks/            # Custom React hooks
    ├── useAuth.ts
    ├── useSearch.ts
    └── usePageTitle.ts
```

## 🔑 Key Features

### Implemented ✅
- Modern UI design system with Tailwind CSS
- Firebase Authentication (Google OAuth)
- Admin panel with role-based access control
- Blog posts with Markdown editor and syntax highlighting
- Projects portfolio with GitHub API integration
- Field notes quick-add interface
- Articles management with LinkedIn metadata
- Client-side search with Fuse.js
- Google Analytics 4 integration
- WCAG 2.1 Level AA accessibility (70% compliant)
- Image optimization with lazy loading
- Route-based code splitting

### Pending ⏳
- Admin custom claim setup (BLOCKING)
- Field Notes content migration
- LinkedIn article scraping automation
- Production deployment to iFastNet
- CI/CD pipeline setup

## 📊 Database Collections

### Firestore Schema
```typescript
posts/        // Blog posts
  - title, slug, summary, body
  - tags[], published, featured
  - authorId, createdAt, updatedAt

projects/     // Portfolio projects
  - name, description, summary
  - technologies[], githubUrl, liveUrl
  - isVisible, isPinned, source
  - githubData (stars, language)

notes/        // Field notes
  - content, tags[], type
  - mood, isPublic
  - createdAt

articles/     // LinkedIn articles
  - title, url, description
  - imageUrl, publishedAt
  - linkedinData (reactions, comments)
  - isVisible, source
```

## 🔒 Security

### Environment Variables
- `.env` - Production credentials (gitignored)
- `.env.example` - Template for setup

### Firestore Rules
- Admin-only write operations
- Public read for published content
- Field validation on all collections
- Custom claims authentication

### Security Checklist
- [x] Environment variables gitignored
- [x] Source maps disabled in production
- [x] Console logging removed from production
- [x] Admin token validation in Firestore rules
- [ ] Admin custom claim configured (NEXT)

## 🎯 Development Workflow

### Creating Content
1. Navigate to `/login` and sign in with Google
2. Access admin panel at `/admin`
3. Use managers: Posts, Projects, Articles, Notes
4. Content auto-saves to Firestore
5. View public site immediately

### Adding a Blog Post
1. Admin → Posts Manager
2. Click "New Post"
3. Write in Markdown with preview
4. Add tags, upload images
5. Toggle "Published" when ready

### Adding a Project
1. Admin → Projects Manager
2. Option A: Manual entry with form
3. Option B: Paste GitHub URL → "Sync from GitHub"
4. Set visibility and pin status
5. Save to Firestore

## 📈 Analytics

### Google Analytics 4
- **Measurement ID**: `G-7XWKQCMWH7`
- **Web Vitals**: LCP, FID, CLS, FCP, TTFB
- **Custom Events**: Content interactions, searches
- **Page Views**: Automatic tracking

### Performance Targets
- LCP (Largest Contentful Paint): < 2.0s ✅
- Bundle Size: ~192 KB gzipped ✅
- Accessibility: WCAG 2.1 Level AA (70% → target 100%)

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Firebase
firebase login           # Authenticate CLI
firebase deploy          # Deploy to hosting
firebase deploy --only firestore:rules  # Deploy rules only

# Quality
npm run lint             # Run ESLint
npm run typecheck        # TypeScript validation
```

## 📚 Documentation

- `PLANNING.md` - Project vision and architecture
- `TASKS.md` - Task breakdown and progress tracking
- `CLAUDE.md` - Session logs and development history
- `docs/ADMIN_SETUP.md` - Admin claim setup guide
- `docs/ACCESSIBILITY_AUDIT.md` - WCAG compliance report
- `docs/PERFORMANCE_TESTING.md` - Performance testing guide
- `FIREBASE_CONFIG_STATUS.md` - Firebase configuration details

## 🆘 Troubleshooting

### "Access Denied" on Admin Panel
→ Admin custom claim not set. Follow setup in `docs/ADMIN_SETUP.md`

### Firebase Connection Error
→ Check `.env` file exists with correct credentials

### Build Errors
→ Run `npm install` and verify TypeScript compilation

### Images Not Uploading
→ Verify Firebase Storage bucket configured in console

## 🎯 Project Goals

**Primary**: Modern, performant portfolio site with automated content syndication
**Tech Stack**: Vite + React + TypeScript + Firebase + Tailwind CSS
**Hosting**: iFastNet (static files)
**Target**: LCP < 2.0s, WCAG Level AA, SEO optimized

---

**Last Updated**: 2025-10-05 | **Next Priority**: Admin claim setup (30 min)
