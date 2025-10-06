# Developer Onboarding Guide

**Welcome to ScottKunian.com v4 Development!**

This guide will help you get up and running with the project, understand the architecture, and contribute effectively.

## 🎯 Getting Started (15 minutes)

### Step 1: Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version
# v20.x.x or higher

# Check npm version (need 9+)
npm --version
# 9.x.x or higher

# Check Git
git --version
```

### Step 2: Clone and Install

```bash
# Clone repository
git clone https://github.com/scottkunian/scottkunian.com-v4.git
cd scottkunian.com-v4

# Install dependencies
npm install
# ✅ Should complete without errors
```

### Step 3: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Open .env and add Firebase credentials
# Get these from Firebase Console → Project Settings → Config
```

**Minimal `.env` for development**:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
  VITE v4.5.14  ready in 425 ms

  ➜  Local:   http://localhost:3003/
  ➜  Network: use --host to expose
```

Open http://localhost:3003 - you should see the homepage! ✅

## 🏗️ Project Architecture

### Tech Stack Overview

```
Frontend: React 18 + TypeScript 5 + Vite 4
Styling: Tailwind CSS 3 + PostCSS
Backend: Firebase (Auth, Firestore, Storage, Hosting)
Routing: React Router 6
Analytics: Google Analytics 4 + Web Vitals
```

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (Button, Card, Input)
│   ├── editor/         # Markdown editor
│   ├── auth/           # Auth components (ProtectedRoute)
│   └── accessibility/  # A11y components (SkipNav, LiveRegion)
├── pages/              # Route pages (Home, Blog, Projects)
├── admin/              # Admin panel (PostsManager, etc.)
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── styles/             # Global CSS and Tailwind config
└── App.tsx             # Root component with routing
```

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, routing setup, layout |
| `src/lib/firebase.ts` | Firebase initialization |
| `src/lib/firestore.ts` | Database CRUD operations |
| `src/lib/storage.ts` | File upload utilities |
| `tailwind.config.js` | Design system configuration |
| `firestore.rules` | Database security rules |
| `.github/workflows/` | CI/CD pipelines |

## 📦 Key Concepts

### 1. Firebase Integration

**Authentication**:
```typescript
import { auth } from './lib/firebase';
import { useAuth } from './hooks/useAuth';

// In component
const { user, loading } = useAuth();
```

**Firestore Operations**:
```typescript
import { getPosts, createDocument, COLLECTIONS } from './lib/firestore';

// Get data
const posts = await getPosts(true); // published only

// Create data
await createDocument(COLLECTIONS.POSTS, {
  title: 'New Post',
  body: 'Content...',
  published: false,
});
```

**File Uploads**:
```typescript
import { uploadImage } from './lib/storage';

const url = await uploadImage(file, 'posts');
// Returns: https://firebasestorage.googleapis.com/...
```

### 2. Component Patterns

**Base Components** (src/components/ui/):
```typescript
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

// Usage
<Button variant="primary" size="small" loading={isSubmitting}>
  Save
</Button>
```

**Admin Components** (src/admin/):
```typescript
// Manager pattern for CRUD operations
<PostsManager />    // /admin/posts
<ProjectsManager /> // /admin/projects
<ArticlesManager /> // /admin/articles
<NotesManager />    // /admin/notes
```

### 3. Routing Structure

```typescript
// Public routes
/                  → Home
/blog              → Blog listing
/blog/:slug        → Individual post
/projects          → Projects grid
/projects/:id      → Project details
/articles          → Articles listing
/notes             → Field notes
/about             → About page
/contact           → Contact form

// Admin routes (protected)
/admin             → Dashboard
/admin/posts       → Post management
/admin/projects    → Project management
/admin/articles    → Article management
/admin/notes       → Note management
```

### 4. Type Safety with TypeScript

**Firestore Interfaces** (src/lib/firestore.ts):
```typescript
interface Post {
  id?: string;
  title: string;
  slug: string;
  body: string;
  tags: string[];
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Always use interfaces for data**:
```typescript
const [posts, setPosts] = useState<Post[]>([]);
const [project, setProject] = useState<Project | null>(null);
```

## 🛠️ Common Development Tasks

### Adding a New UI Component

```bash
# 1. Create component file
touch src/components/ui/MyComponent.tsx

# 2. Write component (example)
cat > src/components/ui/MyComponent.tsx << 'EOF'
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <button onClick={onClick} className="btn-primary">
      {title}
    </button>
  );
}
EOF

# 3. Export from index (optional)
# Add to src/components/ui/index.ts if it exists

# 4. Use in pages
import { MyComponent } from '@/components/ui/MyComponent';
```

### Adding a New Page

```bash
# 1. Create page directory and component
mkdir -p src/pages/NewPage
touch src/pages/NewPage/NewPage.tsx

# 2. Create page component
# (Write your component code)

# 3. Add route in App.tsx
# Import and add <Route> element

# 4. Add navigation link in Header.tsx
```

### Working with Firestore

```typescript
// Create
await createDocument(COLLECTIONS.POSTS, {
  title: 'New Post',
  // ... other fields
});

// Read
const posts = await getPosts();
const post = await getPostBySlug('my-slug');

// Update
await updateDocument(COLLECTIONS.POSTS, postId, {
  title: 'Updated Title',
});

// Delete
await deleteDocument(COLLECTIONS.POSTS, postId);
```

### Adding an Admin Feature

1. **Create Manager Component** in `src/admin/`
2. **Add CRUD Operations** using Firestore helpers
3. **Create UI** with list + editor pattern
4. **Add Route** in `AdminDashboard.tsx`
5. **Test** functionality end-to-end

Example structure:
```typescript
export function MyManager() {
  return (
    <Routes>
      <Route path="/" element={<MyList />} />
      <Route path="/new" element={<MyEditor />} />
      <Route path="/edit/:id" element={<MyEditor />} />
    </Routes>
  );
}
```

## 🎨 Styling Guidelines

### Tailwind Utility Classes

```typescript
// Spacing
className="p-4 mt-6 space-y-4"

// Colors (from theme)
className="bg-primary-600 text-white"
className="bg-secondary-100 text-secondary-900"

// Typography
className="text-2xl font-bold tracking-tight"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Dark mode (if enabled)
className="bg-white dark:bg-gray-900"
```

### Design Tokens (tailwind.config.js)

```javascript
colors: {
  primary: { 50-900 },    // Brand color
  secondary: { 50-900 },  // Gray scale
  accent: { 50-900 },     // Highlight color
  success: green,
  warning: yellow,
  error: red,
}

fontSize: {
  xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
}

spacing: {
  // Tailwind defaults: 0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64
}
```

### Component Styling Pattern

```typescript
// 1. Use Tailwind utilities first
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">

// 2. Extract to custom CSS only for complex patterns
<div className="card-elevated">  // defined in styles/index.css

// 3. Avoid inline styles unless absolutely necessary
```

## 🔍 Debugging Tips

### React DevTools

1. Install React DevTools browser extension
2. Open DevTools → React tab
3. Inspect component props and state

### Firebase Emulator (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulators
firebase emulators:start
# Auth: http://localhost:9099
# Firestore: http://localhost:8080
# Storage: http://localhost:9199
# UI: http://localhost:4000
```

### TypeScript Errors

```bash
# Check types without building
npm run typecheck

# Common fixes:
# - Add proper interfaces for props
# - Use `as` type assertions carefully
# - Check import paths
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Common Issues

**Issue**: "Firebase not initialized"
**Fix**: Check `.env` has all `VITE_FIREBASE_*` variables

**Issue**: "403 Forbidden" on Firestore
**Fix**: Check `firestore.rules` and ensure user is authenticated

**Issue**: "Module not found"
**Fix**: Check import paths, restart dev server

## 📚 Code Patterns

### Async Operations

```typescript
// Always handle loading and error states
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    await someAsyncOperation();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};
```

### Form Handling

```typescript
const [formData, setFormData] = useState({
  title: '',
  body: '',
});

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

<Input
  value={formData.title}
  onChange={(e) => handleChange('title', e.target.value)}
/>
```

### Protected Routes

```typescript
import { AdminRoute } from '@/components/auth/ProtectedRoute';

<Route path="/admin/*" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Page loads without errors
- [ ] All links work correctly
- [ ] Forms submit successfully
- [ ] Images load properly
- [ ] Responsive on mobile
- [ ] Works in Chrome, Firefox, Safari
- [ ] Keyboard navigation works
- [ ] No console errors

### Performance Testing

```bash
# Build production bundle
npm run build

# Check bundle sizes
ls -lh dist/assets/

# Target: Total < 250 KB gzipped
```

## 📖 Learning Resources

### Official Docs
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Project-Specific
- [PLANNING.md](../PLANNING.md) - Architecture decisions
- [TASKS.md](../TASKS.md) - Development roadmap
- [Component docs](./COMPONENTS.md) - Component API reference

## 🆘 Getting Help

### Internal Resources
1. Check [PLANNING.md](../PLANNING.md) for architecture
2. Check [TASKS.md](../TASKS.md) for known issues
3. Search [CLAUDE.md](../CLAUDE.md) for development history

### External Help
- **GitHub Issues** - Report bugs or feature requests
- **Stack Overflow** - React/TypeScript questions
- **Firebase Community** - Firebase-specific issues

## ✅ Next Steps

After completing this guide, you should:

1. ✅ Have dev server running
2. ✅ Understand project structure
3. ✅ Know how to add components
4. ✅ Be familiar with Firestore operations
5. ✅ Ready to contribute!

**Recommended First Task**:
- Fix a small UI bug
- Add a new component variant
- Improve documentation
- Write tests for existing components

---

**Welcome to the team!** If you have questions, open a GitHub Discussion or contact [@scottkunian](https://github.com/scottkunian).
