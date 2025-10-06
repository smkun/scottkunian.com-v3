# ScottKunian.com v4 Planning Document

## Vision

This project modernizes ScottKunian.com by transforming it from basic HTML/CSS/JS into a React-based application with Firebase backend, automated content syndication, and a streamlined admin experience (`PRD.md`). The site will showcase projects, field notes, blog posts, and LinkedIn articles through a component-driven architecture that maintains fast load times while enabling rich content management. The new design will feature clean, modern UI elements and professional typography, moving away from emoji-heavy branding to establish a more sophisticated visual identity that appeals to both technical and business audiences. By integrating GitHub and LinkedIn APIs with Firebase automation, the platform will reduce manual maintenance while providing a professional showcase for Scott's technical work and writing.

## Tech Stack

| Technology              | Version/Variant                          | Purpose                                                      |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| **Frontend Framework**  | Vite + React + TypeScript                | Component-based UI with fast builds (`PRD.md` Section 4)     |
| **Styling**             | Tailwind CSS + Custom Design System      | Modern UI components, professional typography, clean layouts |
| **Backend Services**    | Firebase (Firestore + Storage + Auth)    | Content storage, authentication, file hosting                |
| **Authentication**      | Firebase Auth (Google provider)          | Admin access control (`PRD.md` Section 2)                    |
| **Build Tool**          | Vite with SSG capabilities               | Static site generation for performance                       |
| **Automation Platform** | Cloudflare Workers or Firebase Functions | LinkedIn/GitHub content syndication                          |
| **Hosting**             | iFastNet (static files)                  | Low-cost static hosting (`PRD.md` Section 4)                 |
| **Search**              | Fuse.js (client-side)                    | Fast local search without server dependencies                |
| **Analytics**           | GA4 or Plausible                         | Traffic and engagement tracking                              |
| **Content Format**      | Markdown                                 | Blog posts and field notes formatting                        |

## Components and Boundaries

### Frontend Components

-   **Public Site** (`/src/pages/`)

    -   Home: Hero + content highlights
    -   About: Bio and contact information
    -   Projects: Grid view with tech filters (`PRD.md` Section 6)
    -   Field Notes: Chronological list with tag filtering
    -   Blog: Post list and detail pages with Markdown rendering
    -   Articles: LinkedIn content syndication display
    -   Contact: Links and optional contact form

-   **Admin Panel** (`/src/admin/`)
    -   Authentication gate with Google sign-in
    -   Content management for posts, notes, projects
    -   Image upload interface for Firebase Storage
    -   Manual refresh controls for automated content (`PRD.md` Section 7)

### Backend Boundaries

-   **Firebase Firestore Collections** (`PRD.md` Section 5)

    -   `posts`: Blog content with Markdown body
    -   `notes`: Short-form field notes
    -   `projects`: Portfolio items (manual + GitHub-sourced)
    -   `articles`: LinkedIn article metadata and links

-   **External Integrations**
    -   GitHub API: Nightly repository sync
    -   LinkedIn: Daily article parsing and import
    -   Firebase Storage: Image and asset hosting

## External Services and Data Flow

### Service Dependencies

1. **GitHub API** (`/users/:user/repos`)

    - Fetches repository metadata nightly
    - Maps to Firestore `projects` collection
    - Admin can override or hide items (`PRD.md` Section 7)

2. **LinkedIn Public Profile**

    - Parses public articles page via scheduled function
    - Extracts titles, URLs, publication dates, images
    - Writes to Firestore `articles` collection

3. **Firebase Services**
    - Firestore: Primary content database
    - Storage: Image and file hosting
    - Auth: Google-based admin authentication
    - Functions/Hosting: Automation runtime (`PRD.md` Section 4)

### Data Flow Patterns

```text
External Sources → Scheduled Jobs → Firestore → React Components → Static Build → iFastNet

GitHub Repos ──┐
               ├─→ Cloud Functions ──→ Firestore ──→ Admin Panel ──→ Public Site ──→ Static Files
LinkedIn ──────┘                                        ↑
                                                         └─── Manual Content Entry
```

## Key Decisions and Rationale

| Decision                               | Rationale                                                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Vite + React over Next.js**          | Simpler static builds for iFastNet hosting; no server-side rendering needed (`PRD.md` Goals)               |
| **Firebase over custom backend**       | Managed services reduce maintenance; built-in auth and real-time capabilities (`PRD.md` Non-goals)         |
| **Static hosting on iFastNet**         | Cost-effective; matches current hosting provider; fast CDN delivery                                        |
| **Client-side search (Fuse.js)**       | No server dependencies; works with static hosting; good performance for content size                       |
| **Scheduled automation over webhooks** | More reliable for content syndication; easier debugging; no webhook security concerns (`PRD.md` Section 7) |
| **Firestore over SQL database**        | Document model fits content structure; real-time updates; integrated with Firebase ecosystem               |
| **Google Auth only**                   | Single admin user; simplifies implementation; leverages existing Google workspace (`PRD.md` Section 2)     |
| **Markdown for content**               | Developer-friendly; portable; good ecosystem support; enables rich formatting (`PRD.md` Section 6)         |
| **Modern design over emoji branding**  | Professional visual identity; broader audience appeal; improved accessibility and readability              |

## Open Questions and Risks

### Technical Risks

| Risk                                  | Impact                  | Next Steps                                                                                        |
| ------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| **LinkedIn HTML parsing brittleness** | Content sync failures   | Build robust parser with fallback; implement manual override in admin panel (`PRD.md` Section 12) |
| **GitHub API rate limits**            | Incomplete project sync | Implement caching strategy; use conditional requests; monitor quotas (`PRD.md` Section 12)        |
| **iFastNet static hosting limits**    | Deployment failures     | Validate file size limits; test build process; prepare CDN fallback                               |
| **Firebase costs at scale**           | Budget overruns         | Monitor usage; implement query optimization; set billing alerts                                   |

### Content Strategy Questions

-   **Project curation**: Which GitHub repos should auto-sync vs. manual curation?
-   **Article approval workflow**: Auto-publish LinkedIn imports or require admin approval? (`PRD.md` Section 7)
-   **Legacy content**: How to handle existing Field Notes migration and URL structure? (`PRD.md` Section 10)
-   **SEO impact**: Will static generation adequately replace current page indexing?
-   **Design modernization**: How to transition from emoji-heavy branding while preserving personality?

### Design System Requirements

-   **Visual Identity**: Clean, modern aesthetic with professional typography and subtle visual hierarchy
-   **Color Palette**: Sophisticated color scheme suitable for technical and business audiences
-   **Component Library**: Reusable UI components with consistent spacing, borders, and interaction states
-   **Icon System**: Professional iconography to replace emoji-based navigation and section headers
-   **Layout Patterns**: Grid-based layouts with proper whitespace and responsive breakpoints
-   **Accessibility**: WCAG-compliant contrast ratios, focus states, and keyboard navigation

### Implementation Next Steps

1. **Week 1**: Set up Firebase project, initialize Vite/React scaffolding (`PRD.md` Section 13, M1)
2. **Content audit**: Inventory existing Field Notes for Firestore migration (`PRD.md` Section 10)
3. **API exploration**: Test LinkedIn parsing approach and GitHub API integration patterns
4. **Performance baseline**: Measure current site metrics for improvement tracking (`PRD.md` Section 11)
5. **Design mockups**: Create component wireframes for admin panel and public pages

### Validation Requirements

-   **Security review**: Firestore rules and admin authentication implementation (`PRD.md` Section 9)
-   **Performance testing**: LCP under 2.0s target validation (`PRD.md` Section 11)
-   **Accessibility audit**: WCAG compliance verification (`PRD.md` Section 8)
-   **Content migration testing**: Field Notes and project data integrity verification

---

_Generated from `PRD.md` requirements and architectural analysis_
