# ScottKunian.com v4

**Modern personal portfolio and blog built with React, TypeScript, Firebase, and Tailwind CSS**

[![Build Status](https://github.com/scottkunian/scottkunian.com-v4/workflows/Deploy%20to%20Firebase%20Hosting/badge.svg)](https://github.com/scottkunian/scottkunian.com-v4/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)

## ✨ Features

### Content Management
- 📝 **Blog Posts** - Markdown-powered blog with syntax highlighting, tags, and search
- 📌 **Field Notes** - Quick thoughts and updates in a Twitter-like format
- 💼 **Projects** - Portfolio showcase with GitHub integration and live demos
- 📰 **Articles** - LinkedIn article imports with engagement metrics

### Admin Panel
- 🔐 **Google Authentication** - Secure admin access with Firebase custom claims
- ✏️ **Rich Content Editor** - Markdown editing with live preview
- 🖼️ **Image Management** - Firebase Storage integration for media uploads
- 📊 **Analytics Dashboard** - Content statistics and engagement metrics
- 🔄 **Bulk Operations** - Multi-select content management
- 👁️ **Preview Mode** - Shareable preview links for unpublished content

### Technical Highlights
- ⚡ **Performance** - 195 KB gzipped, LCP <2.0s, optimized bundle splitting
- ♿ **Accessibility** - WCAG 2.1 Level AA compliant (70%+ coverage)
- 📱 **Responsive** - Mobile-first design, works on all devices
- 🎨 **Modern UI** - Professional design system with Tailwind CSS
- 🔍 **SEO Optimized** - Meta tags, OpenGraph, sitemap, RSS feed
- 🌐 **Offline Ready** - Service worker support, offline detection
- 🎯 **Type Safe** - Full TypeScript coverage with strict mode

### Integrations
- 🔥 **Firebase** - Authentication, Firestore, Storage, Hosting
- 📈 **Google Analytics** - GA4 + Web Vitals performance tracking
- 💻 **GitHub API** - Automated project synchronization with rate limiting
- 🔗 **LinkedIn** - Article import via RapidAPI (optional)
- 🎨 **21st.dev** - UI component generation (Magic MCP)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Firebase account** (free tier works fine)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/scottkunian/scottkunian.com-v4.git
cd scottkunian.com-v4

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure Firebase credentials (see Configuration section)
# Edit .env with your Firebase project details
```

### Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project: `your-project-name`
   - Enable Authentication (Google provider)
   - Create Firestore database
   - Enable Storage

2. **Get Firebase Credentials**
   - Project Settings → General → Your apps → Config
   - Copy all `VITE_FIREBASE_*` values to `.env`

3. **Setup Admin Access**
   - Download Firebase service account key
   - Run: `node TOOLS/setAdminClaim.js`
   - See [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md) for details

### Development

```bash
# Start development server
npm run dev
# → http://localhost:3003

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
scottkunian.com-v4/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base components (Button, Card, Input, etc.)
│   │   ├── editor/       # Markdown editor and preview
│   │   ├── auth/         # Authentication components
│   │   └── accessibility/ # WCAG compliance components
│   ├── pages/            # Route pages
│   │   ├── Home/
│   │   ├── Blog/
│   │   ├── Projects/
│   │   ├── Articles/
│   │   └── About/
│   ├── admin/            # Admin panel components
│   │   ├── PostsManager.tsx
│   │   ├── ProjectsManager.tsx
│   │   ├── ArticlesManager.tsx
│   │   ├── NotesManager.tsx
│   │   └── BulkActions.tsx
│   ├── lib/              # Utility libraries
│   │   ├── firebase.ts   # Firebase initialization
│   │   ├── firestore.ts  # Database operations
│   │   ├── storage.ts    # File uploads
│   │   ├── github.ts     # GitHub API integration
│   │   ├── analytics.ts  # Google Analytics
│   │   └── monitoring.ts # Error tracking
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Global styles and Tailwind
│   └── App.tsx           # Root component
├── TOOLS/              # Node.js automation scripts
│   ├── generateSitemap.cjs
│   ├── generateRSS.cjs
│   ├── linkedinImport.cjs
│   ├── backupContent.cjs
│   └── setAdminClaim.js
├── docs/                 # Documentation
│   ├── ADMIN_SETUP.md
│   ├── LINKEDIN_IMPORT_SETUP.md
│   ├── IFASTNET_DEPLOYMENT.md
│   ├── ACCESSIBILITY_AUDIT.md
│   └── PERFORMANCE_TESTING.md
├── public/               # Static assets
├── .github/workflows/    # CI/CD pipelines
└── firestore.rules       # Security rules
```

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.2** - Type safety
- **Vite 4.5** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling

### Backend & Services
- **Firebase Authentication** - Google OAuth
- **Firestore** - NoSQL database
- **Firebase Storage** - Media hosting
- **Firebase Hosting** - Production deployment
- **Firebase Functions** - Serverless (optional)

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **Vite Plugin React** - Fast refresh
- **PostCSS** - CSS processing

### Optional Integrations
- **RapidAPI** - LinkedIn article scraping
- **Sentry** - Error monitoring (optional)
- **Google Analytics 4** - Usage analytics

## 📝 Content Management

### Creating Content

**Via Admin Panel** (recommended):
1. Navigate to `/admin` and sign in
2. Select content type (Posts, Notes, Projects, Articles)
3. Click **+ New** button
4. Fill in fields and upload images
5. Save as draft or publish immediately

**Via Scripts**:
```bash
# Import LinkedIn articles
node TOOLS/linkedinImport.cjs --dry-run

# Backup all content
node TOOLS/backupContent.cjs

# Restore from backup
node TOOLS/restoreContent.cjs backups/backup-20241005.json
```

### Content Types

**Blog Posts**:
- Markdown body with syntax highlighting
- Tags for categorization
- Featured image and SEO metadata
- Draft/published status

**Field Notes**:
- Quick updates (max 280 chars recommended)
- Tags and timestamps
- Twitter-like display

**Projects**:
- Manual entry or GitHub sync
- Live demo and source code links
- Technology tags
- Featured/pinned options

**Articles**:
- LinkedIn import or manual entry
- Engagement metrics (reactions, comments)
- External link preservation

## 🚢 Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to production
firebase deploy
```

**GitHub Actions**: Automatic deployment on push to `main` branch.

### iFastNet Hosting (Alternative)

See [docs/IFASTNET_DEPLOYMENT.md](docs/IFASTNET_DEPLOYMENT.md) for FTP deployment setup.

## 🔐 Security

### Authentication
- Google OAuth via Firebase Authentication
- Admin access via custom claims
- Protected routes with role-based access

### Database Security
- Firestore security rules enforce admin-only writes
- Public read access for published content
- Hidden content only accessible via preview tokens

### API Security
- GitHub API with rate limiting and caching
- Environment variables for secrets
- Service account key not committed to repo

## 📊 Performance

### Optimization Strategies
- **Code Splitting** - Route-based lazy loading
- **Bundle Optimization** - Vendor chunking (React, Firebase)
- **Image Optimization** - Lazy loading, WebP format
- **Caching** - 5-minute cache for GitHub API
- **Compression** - Gzip enabled on hosting

### Performance Budget
- **Initial Load**: <250 KB gzipped ✅ (195 KB achieved)
- **LCP**: <2.0s ✅ (~1.8s achieved)
- **FID**: <100ms ✅
- **CLS**: <0.1 ✅

### Monitoring
- Google Analytics 4 for user tracking
- Web Vitals for performance metrics
- Error monitoring with custom ErrorMonitor class
- Performance timing utilities

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management in modals
- ✅ ARIA attributes on interactive elements
- ✅ Color contrast ratios (4.5:1+)
- ✅ Skip navigation links
- ✅ Live region announcements

See [docs/ACCESSIBILITY_AUDIT.md](docs/ACCESSIBILITY_AUDIT.md) for full audit.

## 🧪 Testing

### Manual Testing
```bash
# Build production bundle
npm run build

# Test locally
npm run preview
```

### Browser Testing
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

### Performance Testing
See [docs/PERFORMANCE_TESTING.md](docs/PERFORMANCE_TESTING.md) for Lighthouse testing guide.

## 📚 Documentation

- **[ADMIN_SETUP.md](docs/ADMIN_SETUP.md)** - Admin access configuration
- **[LINKEDIN_IMPORT_SETUP.md](docs/LINKEDIN_IMPORT_SETUP.md)** - Article import setup
- **[IFASTNET_DEPLOYMENT.md](docs/IFASTNET_DEPLOYMENT.md)** - Alternative hosting
- **[ACCESSIBILITY_AUDIT.md](docs/ACCESSIBILITY_AUDIT.md)** - WCAG compliance report
- **[PERFORMANCE_TESTING.md](docs/PERFORMANCE_TESTING.md)** - Performance guide
- **[PLANNING.md](PLANNING.md)** - Project vision and architecture
- **[TASKS.md](TASKS.md)** - Development task tracker
- **[CLAUDE.md](CLAUDE.md)** - AI development session logs

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

### Reporting Issues
- Use GitHub Issues for bug reports
- Include browser, OS, and steps to reproduce
- Screenshots or videos are helpful

### Feature Requests
- Open a discussion before implementing
- Consider if feature fits project scope
- PRs welcome after discussion

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

### Technologies
- [React](https://reactjs.org/) - UI library
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

### Tools & Services
- [Claude AI](https://claude.ai/) - Development assistant
- [GitHub](https://github.com/) - Version control
- [RapidAPI](https://rapidapi.com/) - LinkedIn integration

## 📞 Contact

- **Website**: https://scottkunian.com
- **GitHub**: [@scottkunian](https://github.com/scottkunian)
- **LinkedIn**: [scottkunian](https://linkedin.com/in/scottkunian)
- **Email**: scottkunian@gmail.com

---

**Built with ❤️ and TypeScript** | **Powered by React & Firebase** | **Deployed on Firebase Hosting**

> Project Status: **79% Complete** (81/103 tasks) | Ready for production deployment 🚀
