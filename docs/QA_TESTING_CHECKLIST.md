# QA Testing Checklist - ScottKunian.com v4

**Project**: ScottKunian.com v4
**Date**: October 5, 2025
**Purpose**: Comprehensive quality assurance testing before production deployment

---

## Pre-Testing Setup

### Environment Preparation
- [ ] **Local development server running** (`npm run dev`)
- [ ] **Production build successful** (`npm run build`)
- [ ] **Firebase credentials configured** (`.env` file)
- [ ] **Admin claim set** (can access admin panel)
- [ ] **Test content available** (sample posts, projects, articles, notes)

### Testing Tools
- [ ] **Browsers installed**:
  - [ ] Chrome/Chromium (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (if on macOS)
  - [ ] Edge (latest)
- [ ] **Mobile devices/emulators**:
  - [ ] iOS (iPhone 13 or newer simulator)
  - [ ] Android (Pixel emulator)
- [ ] **Testing tools**:
  - [ ] Chrome DevTools
  - [ ] React DevTools extension
  - [ ] Lighthouse (Chrome)
  - [ ] axe DevTools (accessibility)
  - [ ] Network throttling enabled

---

## 1. Authentication Testing

### Google Sign-In Flow
- [ ] **Navigate to** `/admin/login`
- [ ] **Click** "Sign in with Google"
- [ ] **Verify** Google OAuth popup appears
- [ ] **Sign in** with test Google account
- [ ] **Verify** successful redirect to `/admin`
- [ ] **Check** user name displays in header
- [ ] **Verify** "Logout" button appears

### Admin Access Control
- [ ] **With admin claim**: Can access `/admin` routes
- [ ] **Without admin claim**: See "Access Denied" message
- [ ] **Not authenticated**: Redirect to `/admin/login`
- [ ] **Logout**: Returns to home, clears session

### Security
- [ ] **Direct URL access** to `/admin/*` requires auth
- [ ] **Firebase Security Rules** enforce admin token
- [ ] **No console errors** during auth flow
- [ ] **Session persistence** after page refresh

**Pass Criteria**: ✅ All auth flows work without errors, unauthorized users blocked

---

## 2. Content Management Testing

### Posts Management

#### Create Post
- [ ] **Navigate to** `/admin/posts`
- [ ] **Click** "Add Post"
- [ ] **Fill in**:
  - [ ] Title: "Test Blog Post"
  - [ ] Slug: Auto-generated correctly
  - [ ] Summary: "This is a test summary"
  - [ ] Tags: "test", "qa"
  - [ ] Body: Markdown with code block
- [ ] **Upload** cover image
- [ ] **Preview** markdown rendering
- [ ] **Save as draft** (published = false)
- [ ] **Verify** post appears in posts list

#### Edit Post
- [ ] **Click** edit on test post
- [ ] **Modify** title to "Updated Test Post"
- [ ] **Toggle** published to true
- [ ] **Save changes**
- [ ] **Verify** updated title in list
- [ ] **Verify** published badge shows

#### Delete Post
- [ ] **Click** delete on test post
- [ ] **Verify** confirmation dialog appears
- [ ] **Confirm** deletion
- [ ] **Verify** post removed from list

### Projects Management

#### Create Project
- [ ] **Navigate to** `/admin/projects`
- [ ] **Click** "Add Project"
- [ ] **Fill in** all required fields
- [ ] **Upload** project image
- [ ] **Add** technologies (press Enter to add)
- [ ] **Toggle** visibility and featured
- [ ] **Save** project

#### GitHub Sync
- [ ] **Enter** valid GitHub URL (https://github.com/user/repo)
- [ ] **Click** "Sync from GitHub"
- [ ] **Verify** data populates (description, technologies, stars)
- [ ] **Check** last sync timestamp updates
- [ ] **Verify** manual overrides preserved

#### Edit/Delete Project
- [ ] **Edit** project successfully
- [ ] **Delete** with confirmation works

### Articles Management

#### Create Article
- [ ] **Navigate to** `/admin/articles`
- [ ] **Add** manual article
- [ ] **Fill in** LinkedIn metadata (reactions, comments)
- [ ] **Toggle** visibility
- [ ] **Save** and verify in list

### Notes Management

#### Create Field Note
- [ ] **Navigate to** `/admin/notes`
- [ ] **Quick-add** note with content
- [ ] **Select** type (thought/observation/learning/idea)
- [ ] **Select** mood (optional)
- [ ] **Add** tags
- [ ] **Toggle** visibility
- [ ] **Save** and verify in list

**Pass Criteria**: ✅ All CRUD operations work for all content types

---

## 3. Public Pages Testing

### Home Page (`/`)
- [ ] **Loads** without errors
- [ ] **Hero section** displays correctly
- [ ] **Recent content** previews show
- [ ] **Call-to-action** buttons work
- [ ] **Navigation** links functional
- [ ] **Footer** renders with correct info

### Blog Page (`/blog`)
- [ ] **Posts list** displays published posts only
- [ ] **Post cards** show title, summary, date, tags
- [ ] **Tag filtering** works correctly
- [ ] **Search** finds posts by title/content
- [ ] **Pagination** works (if implemented)
- [ ] **Click post** navigates to detail page

### Blog Post Detail (`/blog/:slug`)
- [ ] **Post renders** with correct formatting
- [ ] **Markdown** converts to HTML properly
- [ ] **Code blocks** have syntax highlighting
- [ ] **Images** display correctly
- [ ] **Meta tags** populated for SEO
- [ ] **Back button** returns to blog list

### Projects Page (`/projects`)
- [ ] **Projects grid** displays all visible projects
- [ ] **Featured projects** section (if pinned exist)
- [ ] **Technology filters** work correctly
- [ ] **Project cards** show image, name, description, tech stack
- [ ] **GitHub stats** display (stars, language)
- [ ] **View Code/Live Demo** buttons work
- [ ] **Click project** navigates to detail page

### Project Detail (`/projects/:id`)
- [ ] **Project loads** with full description
- [ ] **Markdown rendering** works
- [ ] **Images** display
- [ ] **GitHub stats** show
- [ ] **Links** work (GitHub, live demo)
- [ ] **Back button** functional

### Articles Page (`/articles`)
- [ ] **Articles list** displays visible articles only
- [ ] **LinkedIn badge** shows for LinkedIn sources
- [ ] **Engagement stats** display (reactions, comments)
- [ ] **"Read Article" button** links externally
- [ ] **Filtering** works (if implemented)

### Field Notes Page (`/field-notes`)
- [ ] **Notes display** chronologically
- [ ] **Type badges** show (thought/observation/learning/idea)
- [ ] **Mood indicators** display (if set)
- [ ] **Tag filtering** works
- [ ] **Search** finds notes by content
- [ ] **Visible notes** only (isVisible = true)

### About Page (`/about`)
- [ ] **Content loads** correctly
- [ ] **Bio displays** properly
- [ ] **Contact info** present
- [ ] **Links work** (social, email, etc.)

### Contact Page (`/contact`)
- [ ] **Contact info** displays
- [ ] **Social links** work
- [ ] **Email link** opens mail client
- [ ] **Form works** (if implemented)

**Pass Criteria**: ✅ All public pages load and display content correctly

---

## 4. Search & Filtering Testing

### Global Search
- [ ] **Open search** (header search component)
- [ ] **Type** "test"
- [ ] **Verify** results from all collections (posts, projects, articles, notes)
- [ ] **Results highlight** matched terms
- [ ] **Keyboard navigation** works (arrow keys, Enter)
- [ ] **Click result** navigates to correct page
- [ ] **Click outside** closes search

### Blog Tag Filtering
- [ ] **Click tag** on blog page
- [ ] **Verify** only posts with that tag show
- [ ] **Clear filter** shows all posts again

### Projects Technology Filtering
- [ ] **Click technology** filter button
- [ ] **Verify** only projects with that tech show
- [ ] **Multiple filters** work (AND/OR logic)
- [ ] **Clear filters** shows all projects

**Pass Criteria**: ✅ Search and filtering work accurately

---

## 5. Responsive Design Testing

### Mobile (375px - 767px)
- [ ] **Header**: Hamburger menu works, navigation accessible
- [ ] **Content**: Stacks vertically, readable without horizontal scroll
- [ ] **Images**: Scale correctly, maintain aspect ratio
- [ ] **Buttons**: Touch-friendly (min 44x44px)
- [ ] **Forms**: Input fields full-width, easy to tap
- [ ] **Cards**: Stack in single column
- [ ] **Footer**: Stacks vertically, links accessible

### Tablet (768px - 1023px)
- [ ] **Layout**: 2-column grid where appropriate
- [ ] **Navigation**: Full menu visible or accessible
- [ ] **Content**: Comfortable reading width
- [ ] **Images**: Optimized for medium screens

### Desktop (1024px+)
- [ ] **Layout**: Multi-column grids (2-3 columns)
- [ ] **Navigation**: Full horizontal menu
- [ ] **Content**: Max-width for readability
- [ ] **Images**: High-resolution, well-positioned

### Orientation Changes
- [ ] **Rotate device**: Layout adjusts smoothly
- [ ] **No content cutoff** in landscape/portrait

**Test Devices**:
- [ ] iPhone 13 (375x812)
- [ ] iPad (768x1024)
- [ ] Desktop 1920x1080
- [ ] Desktop 2560x1440

**Pass Criteria**: ✅ Site usable on all screen sizes without horizontal scroll

---

## 6. Cross-Browser Compatibility

### Chrome (Primary)
- [ ] **All features** work
- [ ] **Styling** correct
- [ ] **No console errors**

### Firefox
- [ ] **Layout consistent** with Chrome
- [ ] **JavaScript** functions properly
- [ ] **Forms** work correctly
- [ ] **No console errors**

### Safari
- [ ] **Webkit quirks** handled (if any)
- [ ] **iOS Safari** (mobile) works
- [ ] **Fonts** render correctly
- [ ] **Flexbox/Grid** layouts work

### Edge
- [ ] **Chromium-based Edge** works like Chrome
- [ ] **Legacy Edge** (if support needed) functional

**Pass Criteria**: ✅ Core functionality works in all tested browsers

---

## 7. Performance Testing

### Lighthouse Audit
- [ ] **Run** Lighthouse in Chrome DevTools (Incognito mode)
- [ ] **Performance score**: ≥90
- [ ] **Accessibility score**: ≥90
- [ ] **Best Practices score**: ≥90
- [ ] **SEO score**: ≥90
- [ ] **LCP** (Largest Contentful Paint): <2.0s ✅ Target
- [ ] **FID** (First Input Delay): <100ms
- [ ] **CLS** (Cumulative Layout Shift): <0.1

### Core Web Vitals
- [ ] **LCP**: Largest content paint <2.5s (good)
- [ ] **INP**: Interaction to Next Paint <200ms (good)
- [ ] **CLS**: Layout shift <0.1 (good)
- [ ] **FCP**: First Contentful Paint <1.8s
- [ ] **TTFB**: Time to First Byte <800ms

### Bundle Size
- [ ] **Total gzipped**: ~195 KB ✅ Target met
- [ ] **JavaScript chunks**: Code-split appropriately
- [ ] **CSS**: Single bundle, optimized
- [ ] **Images**: Lazy-loaded, optimized

### Network Performance
- [ ] **Test on 3G** (throttled): Still usable
- [ ] **Test on 4G**: Fast load times
- [ ] **Images**: Load progressively
- [ ] **Fonts**: No FOIT (Flash of Invisible Text)

**Pass Criteria**: ✅ Performance scores ≥90, LCP <2.0s

---

## 8. Accessibility Testing

### Keyboard Navigation
- [ ] **Tab** through all interactive elements
- [ ] **Focus indicators** visible on all elements
- [ ] **Skip to main content** link works
- [ ] **Modal dialogs** trap focus
- [ ] **Escape key** closes modals/search
- [ ] **Enter/Space** activates buttons

### Screen Reader Testing
- [ ] **VoiceOver (Mac)** or **NVDA (Windows)**:
  - [ ] Page structure announced correctly (headings, landmarks)
  - [ ] Form labels read properly
  - [ ] Button purposes clear
  - [ ] Link destinations announced
  - [ ] Image alt text descriptive
  - [ ] Dynamic content updates announced (ARIA live regions)

### Color Contrast
- [ ] **Text**: 4.5:1 contrast ratio (AA standard)
- [ ] **Large text**: 3:1 contrast ratio
- [ ] **Interactive elements**: Sufficient contrast
- [ ] **Focus indicators**: Visible on all backgrounds

### ARIA Attributes
- [ ] **Forms**: aria-label, aria-describedby, aria-required
- [ ] **Buttons**: aria-label for icon-only buttons
- [ ] **Dialogs**: aria-modal, aria-labelledby, aria-describedby
- [ ] **Live regions**: aria-live for dynamic updates
- [ ] **Navigation**: role="navigation", aria-label

### axe DevTools Scan
- [ ] **Run** axe accessibility scanner
- [ ] **Fix** all critical and serious issues
- [ ] **Review** moderate issues
- [ ] **Zero violations** for WCAG 2.1 Level AA

**Pass Criteria**: ✅ WCAG 2.1 Level AA compliant, axe scan passes

---

## 9. Security Testing

### Firebase Security Rules
- [ ] **Unauthenticated user** cannot write to Firestore
- [ ] **Authenticated non-admin** cannot write to collections
- [ ] **Admin user** can write to all collections
- [ ] **Public read** works for published content only

### Authentication Security
- [ ] **Admin routes** require authentication
- [ ] **Custom claims** enforced for admin access
- [ ] **Session expiration** handled gracefully
- [ ] **No tokens** exposed in console/network tab

### Input Validation
- [ ] **Forms**: Required fields validated
- [ ] **File uploads**: File type and size validated
- [ ] **XSS protection**: User input sanitized
- [ ] **SQL injection**: N/A (Firestore NoSQL)

### HTTPS/SSL
- [ ] **Firebase Hosting**: Automatic SSL ✅
- [ ] **All resources**: Loaded over HTTPS
- [ ] **Mixed content warnings**: None

**Pass Criteria**: ✅ No security vulnerabilities, proper access control

---

## 10. Analytics & Monitoring

### Google Analytics 4
- [ ] **GA4 tracking** initialized on page load
- [ ] **Page views** tracked correctly
- [ ] **Custom events** fire (optional)
- [ ] **Web Vitals** sent to GA4
- [ ] **Real-Time reports** show activity

### Firebase Analytics (if used)
- [ ] **Events logging** to Firebase Analytics
- [ ] **User properties** set
- [ ] **Conversion tracking** (if applicable)

### Error Monitoring
- [ ] **Global error handler** catches unhandled errors
- [ ] **Errors logged** to localStorage
- [ ] **Sentry** integration works (if configured)
- [ ] **Console errors**: None in production

**Pass Criteria**: ✅ Analytics tracking confirmed in GA4

---

## 11. SEO Testing

### Meta Tags
- [ ] **Every page** has unique `<title>`
- [ ] **Meta description** present and unique
- [ ] **OpenGraph tags** (og:title, og:description, og:image, og:url)
- [ ] **Twitter Card tags** (twitter:card, twitter:title, etc.)
- [ ] **Canonical URLs** set correctly

### Structured Data
- [ ] **Article schema** on blog posts (optional)
- [ ] **Person schema** on about page (optional)
- [ ] **BreadcrumbList** for navigation (optional)

### Sitemap & Robots
- [ ] **Sitemap.xml** generated and accessible at `/sitemap.xml`
- [ ] **Robots.txt** allows crawling
- [ ] **No broken links** (all internal links work)

### URL Structure
- [ ] **Clean URLs**: `/blog/post-slug` not `/blog?id=123`
- [ ] **Lowercase**: No uppercase in URLs
- [ ] **No trailing slashes** inconsistency

**Pass Criteria**: ✅ SEO score ≥90 in Lighthouse

---

## 12. Edge Cases & Error Handling

### Error States
- [ ] **404 page** for invalid routes
- [ ] **Empty states**: "No posts yet" when no content
- [ ] **Loading states**: Spinners while fetching data
- [ ] **Network errors**: User-friendly error messages
- [ ] **Form validation errors**: Clear, helpful messages

### Content Edge Cases
- [ ] **Very long title**: Doesn't break layout
- [ ] **No image**: Placeholder or graceful handling
- [ ] **No tags**: Still displays correctly
- [ ] **Markdown edge cases**: HTML entities, special characters
- [ ] **Empty content**: Handled gracefully

### Browser Storage
- [ ] **LocalStorage quota**: Handled gracefully
- [ ] **Cookies disabled**: App still works (Firebase uses indexedDB)

**Pass Criteria**: ✅ No crashes, user-friendly error messages

---

## 13. Deployment & Production Testing

### Pre-Deployment Checks
- [ ] **Production build** successful: `npm run build`
- [ ] **No console warnings** in production build
- [ ] **Environment variables** set correctly
- [ ] **Firebase config** points to production project

### Firebase Hosting Deployment
- [ ] **Deploy**: `firebase deploy --only hosting`
- [ ] **Verify** deployment success message
- [ ] **Check** Firebase Console shows new deployment
- [ ] **Visit** production URL

### Post-Deployment Verification
- [ ] **Production site** loads correctly
- [ ] **SSL certificate** valid (green padlock)
- [ ] **Custom domain** (if configured) works
- [ ] **All pages** accessible
- [ ] **Assets** load from CDN
- [ ] **Firestore** reads/writes work in production
- [ ] **Firebase Auth** works in production
- [ ] **Analytics** tracking in production

**Pass Criteria**: ✅ Production deployment successful, all features work

---

## Testing Sign-Off

### Test Summary
- **Total Tests**: ~200+
- **Tests Passed**: ___/___
- **Tests Failed**: ___
- **Critical Issues**: ___
- **Non-Critical Issues**: ___

### Critical Issues (Must Fix Before Launch)
1. ___________________
2. ___________________
3. ___________________

### Non-Critical Issues (Can Fix Post-Launch)
1. ___________________
2. ___________________

### Testers
- **Primary Tester**: ___________________
- **Date Tested**: ___________________
- **Browser Versions**: ___________________
- **Devices Tested**: ___________________

### Sign-Off
- [ ] **QA Manager**: Approved for production ✅
- [ ] **Developer**: All critical issues resolved ✅
- [ ] **Product Owner**: Acceptance criteria met ✅

---

## Post-Launch Monitoring (First 48 Hours)

### Immediate Checks (First Hour)
- [ ] **Site accessible** from multiple locations
- [ ] **No console errors** reported by users
- [ ] **Analytics** showing traffic
- [ ] **No Firebase quota** errors

### 24-Hour Checks
- [ ] **Performance** stable (no degradation)
- [ ] **Error rate** <1%
- [ ] **User feedback** positive (no major complaints)
- [ ] **Search engines** starting to index

### 48-Hour Checks
- [ ] **All features** used successfully
- [ ] **No rollback** needed
- [ ] **Monitoring** shows healthy metrics

---

**Document Created**: 2025-10-05
**Last Updated**: 2025-10-05
**Next Review**: Before production deployment
**Estimated Testing Time**: 4-6 hours (comprehensive)
