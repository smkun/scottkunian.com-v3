# PRD: Modernize ScottKunian.com

## Focus keyword: ScottKunian.com modernization

You will upgrade ScottKunian.com from basic HTML/JS/CSS to a modern stack. Use Firebase for content (Field Notes, Blog, Projects). Automate links to LinkedIn articles and GitHub repos. Add an admin panel to publish posts. Deploy as static files on iFastNet.

---

## 1) Goals and nongoals

### Goals

- Move to a component-based frontend with fast builds
- Store content in Firebase (Firestore + Storage)
- Pull your LinkedIn articles automatically into an articles collection
- Pull/curate GitHub repos into a projects list
- Admin panel to write, edit, and publish posts/notes
- Replace "My Apps" with clearer wording and structure
- Keep load times low. Keep maintenance simple

### Nongoals

- No custom backend servers. Prefer static hosting + scheduled jobs
- No migration to WordPress or similar

---

## 2) Users and roles

- **Visitor**: reads posts, notes, projects, and articles
- **Admin (you)**: creates/edits content, pins projects, approves article imports

Auth: Google signin. Admin marked by a custom claim.

---

## 3) Information architecture and wording

### Toplevel nav

- **Home**: headline + highlights (latest post, featured project, latest article)
- **About**: short bio, skills, contact links
- **Projects** (rename "My Apps")
  - Label options: _Projects & Experiments_, _Builds & Demos_, or _Code & Playgrounds_
- **Field Notes**: short entries
- **Blog**: longform posts
- **Articles**: LinkedIn imports
- **Contact**: links; optional form

---

## 4) Tech stack

- **Frontend**: Vite + React + TypeScript + Tailwind
- **Content**: Firebase Firestore (texts, metadata), Firebase Storage (images)
- **Auth**: Firebase Auth (Google)
- **Automation**
  - **GitHub**: nightly job fetches updated repos cache into Firestore
  - **LinkedIn**: scheduled fetch (Cloudflare Worker or Firebase Scheduled Function) parses your public articles page writes to Firestore
- **Hosting**: iFastNet (upload static build). Jobs run on Firebase/Cloudflare
- **Analytics**: GA4 or Plausible
- **Search**: clientside Fuse.js

---

## 5) Data model (Firestore)

> All docs have: createdAt, updatedAt, status: draft or published

### posts

- title, slug, summary, body (Markdown), tags[], coverImage, featured:boolean

### notes

- title, body (short), tags[]

### projects

- title, slug, summary, tech[], repoUrl, liveUrl, image, pinned:boolean, source: manual or github

### articles

- title, url, publishedAt, image, summary

---

## 6) Core features

### Public site

- **Home**: hero + cards for latest blog, featured project, latest article
- **Projects**: grid from projects; filters by tech; detail pages
- **Field Notes**: reversechron list; tag filter
- **Blog**: list + tags; Markdown render; code highlight
- **Articles**: list of LinkedIn items from articles
- **About/Contact**: copy refresh; links

### Admin panel (authgated)

- **Login**: Google signin; block nonadmins
- **Posts**: create/edit Markdown; upload images to Storage
- **Notes**: quick add/edit inline
- **Projects**: add manual projects; toggle pinned; refresh GitHub cache
- **Articles**: view LinkedIn imports; approve/publish

---

## 7) LinkedIn and GitHub automation

### LinkedIn

- Worker/Function runs daily. Fetch your public articles page. Parse titles, links, dates, images. Write to articles
- Admin has a **Refresh now** button for manual runs

### GitHub

- Nightly job hits /users/:user/repos (sorted by update). Map selected repos to projects (title, desc, topics, stars, url). Admin can hide or override copy

---

## 8) SEO, performance, accessibility

- Prerender key routes (Vite SSG) for fast first paint
- Image compression at build; use WebP/AVIF; lazyload
- Semantic HTML; focus states; valid contrast
- Perpage meta tags + OpenGraph/Twitter cards

---

## 9) Security and privacy

- Reads are public. Writes only for admin via Auth + custom claim
- Validate schema in Firestore rules
- Version rules in repo; deploy with the app

### Rules sketch (illustrative)

`js
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
function isAdmin() {
return request.auth != null && request.auth.token.admin == true;
}

    match /{col}/{doc} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

}
}
`

---

## 10) Migration plan

1. Create Firebase project (Auth, Firestore, Storage)
2. New repo with Vite/React/Tailwind
3. Build layouts and routes; wire Auth
4. Import Field Notes into notes
5. Seed projects; add GitHub cache job
6. Add LinkedIn fetch job; build Articles page
7. QA content, a11y, performance
8. Build static site and upload to iFastNet
9. Keep legacy pages under /legacy/ for backlinks

---

## 11) Success metrics

- LCP under 2.0s on Home
- Bounce rate down 15% in 60 days
- One new post or note per week via admin
- Projects sync runs nightly without manual edits

---

## 12) Risks and mitigations

- **LinkedIn HTML changes** Keep parser small; allow manual add in admin
- **GitHub API limits** Cache nightly; display from Firestore
- **iFastNet limits** Keep site static; run jobs on Firebase/Cloudflare

---

## 13) Milestones

- **M1 Foundation (Week 1)**: scaffolding, auth, layouts
- **M2 Content (Week 2)**: Notes, Blog, Markdown editor, uploads
- **M3 Projects (Week 3)**: grid, detail pages, GitHub cache + admin controls
- **M4 Articles (Week 4)**: LinkedIn ingestion + list page
- **M5 Polish (Week 5)**: a11y, SEO, SSG, analytics, launch

---

## 14) Copy updates (samples)

- **Hero**: "Building useful things and writing down what works"
- **Projects subtitle**: "Handson builds and live demos"
- **Field Notes subtitle**: "Short takes. Things I'm testing"
- **Articles subtitle**: "Pieces I've published on LinkedIn"

---

## 15) Deliverables

- React app (Vite) + Tailwind
- Firestore + Storage setup
- Admin panel with Markdown editor and image upload
- Cloudflare Worker or Firebase Function for LinkedIn
- GitHub sync script
- CI script to build and upload to iFastNet
- Content migration (existing notes + top projects)
