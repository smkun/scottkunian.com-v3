# Component Documentation

Complete reference for all reusable components in ScottKunian.com v4.

## Table of Contents

- [UI Components](#ui-components)
  - [Button](#button)
  - [Card](#card)
  - [Input](#input)
  - [Badge](#badge)
  - [FileUpload](#fileupload)
  - [Image](#image)
  - [ConfirmDialog](#confirmdialog)
  - [Search](#search)
- [Editor Components](#editor-components)
  - [MarkdownEditor](#markdowneditor)
- [Accessibility Components](#accessibility-components)
  - [SkipNav](#skipnav)
  - [LiveRegion](#liveregion)
- [Feature Components](#feature-components)
  - [PreviewMode](#previewmode)
  - [BulkActions](#bulkactions)
  - [SEOHead](#seohead)
- [Authentication Components](#authentication-components)
  - [ProtectedRoute](#protectedroute)
  - [AdminRoute](#adminroute)

---

## UI Components

### Button

**Location**: `src/components/ui/Button.tsx`

Accessible button component with multiple variants, sizes, and loading states.

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  'aria-label'?: string;
}
```

#### Variants

- **primary**: Solid primary color background (default)
- **secondary**: Solid secondary color background
- **outline**: Border with transparent background
- **ghost**: Minimal styling with hover effect

#### Sizes

- **small**: `px-3 py-1.5 text-sm`
- **medium**: `px-4 py-2 text-base` (default)
- **large**: `px-6 py-3 text-lg`

#### Usage Examples

```tsx
// Basic button
<Button>Click Me</Button>

// Primary button with loading state
<Button variant="primary" loading={isSubmitting}>
  Save Changes
</Button>

// Outline button
<Button variant="outline" onClick={handleCancel}>
  Cancel
</Button>

// Small ghost button
<Button variant="ghost" size="small">
  Edit
</Button>

// Icon-only button with aria-label
<Button aria-label="Delete post" onClick={handleDelete}>
  <TrashIcon />
</Button>
```

#### Accessibility Features

- `aria-busy="true"` when loading
- Automatically disabled during loading
- Supports explicit `aria-label` for icon-only buttons
- Keyboard accessible (native button element)
- Focus visible ring on keyboard navigation

---

### Card

**Location**: `src/components/ui/Card.tsx`

Container component with title, content, and footer sections.

#### Components

- **Card**: Main container
- **CardHeader**: Optional header section
- **CardTitle**: Title with configurable heading level
- **CardContent**: Main content area
- **CardFooter**: Optional footer section

#### Props

```typescript
// Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

// CardTitle
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

// CardHeader, CardContent, CardFooter
interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {}
```

#### Usage Examples

```tsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>

// Card with custom heading level
<Card>
  <CardHeader>
    <CardTitle as="h3">Section Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card with custom styling
<Card className="hover:shadow-lg transition-shadow">
  <CardContent>Interactive card</CardContent>
</Card>
```

#### Default Styles

- Background: white
- Border: 1px solid gray-200
- Border radius: rounded-lg
- Shadow: sm
- Padding: Header/Footer (p-6), Content (p-6 pt-0)

---

### Input

**Location**: `src/components/ui/Input.tsx`

Accessible text input with label, helper text, and error state support.

#### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}
```

#### Usage Examples

```tsx
// Basic input with label
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input with helper text
<Input
  label="Username"
  helperText="Must be 3-20 characters, alphanumeric only"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Input with error state
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={passwordError}
  required
/>

// Disabled input
<Input
  label="Account Type"
  value="Premium"
  disabled
/>
```

#### Accessibility Features

- Automatic `id` generation linking label to input
- `aria-invalid` set when error present
- `aria-describedby` linking to helper/error text
- `aria-required` for required fields
- Error messages with `role="alert"`
- Required indicator with `aria-label="required"`
- Unique IDs for proper screen reader associations

#### States

- **Default**: Gray border, white background
- **Focus**: Primary color ring
- **Error**: Red border, red text error message
- **Disabled**: Gray background, cursor not-allowed

---

### Badge

**Location**: `src/components/ui/Badge.tsx`

Small label component for status indicators and tags.

#### Props

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}
```

#### Variants

- **default**: Gray (neutral)
- **primary**: Primary brand color
- **secondary**: Secondary color
- **success**: Green (positive states)
- **warning**: Yellow (caution)
- **error**: Red (errors, destructive)

#### Usage Examples

```tsx
// Default badge
<Badge>Draft</Badge>

// Success badge
<Badge variant="success">Published</Badge>

// Warning badge
<Badge variant="warning">Pending Review</Badge>

// Error badge
<Badge variant="error">Failed</Badge>

// Primary badge with icon
<Badge variant="primary">
  <StarIcon className="w-3 h-3 mr-1" />
  Featured
</Badge>
```

#### Default Styles

- Font size: text-xs
- Font weight: font-medium
- Padding: px-2.5 py-0.5
- Border radius: rounded-full
- Display: inline-flex items-center

---

### FileUpload

**Location**: `src/components/ui/FileUpload.tsx`

File upload component with image preview and Firebase Storage integration.

#### Props

```typescript
interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: 'posts' | 'projects' | 'articles' | 'notes';
  currentImageUrl?: string;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}
```

#### Usage Examples

```tsx
// Basic image upload
<FileUpload
  onUploadComplete={(url) => setImageUrl(url)}
  folder="posts"
/>

// Upload with current image preview
<FileUpload
  onUploadComplete={(url) => setProjectImage(url)}
  folder="projects"
  currentImageUrl={project.imageUrl}
  label="Project Cover Image"
/>

// Custom file type and size
<FileUpload
  onUploadComplete={handleUpload}
  folder="articles"
  accept="image/jpeg,image/png,image/webp"
  maxSizeMB={2}
/>
```

#### Features

- Image preview before and after upload
- Upload progress indicator
- Firebase Storage integration
- File size validation (default: 5MB)
- File type validation
- Loading state during upload
- Error handling with user feedback

#### Default Behavior

- Accepts: `image/*`
- Max size: 5MB
- Auto-generates unique filename with timestamp
- Uploads to `images/{folder}/` in Firebase Storage
- Returns public download URL on completion

---

### Image

**Location**: `src/components/ui/Image.tsx`

Optimized image component with lazy loading, aspect ratio, and error handling.

#### Props

```typescript
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackText?: string;
}
```

#### Usage Examples

```tsx
// Basic optimized image
<Image
  src={article.imageUrl}
  alt={article.title}
  aspectRatio="16:9"
/>

// Image with custom object fit
<Image
  src={project.imageUrl}
  alt={project.name}
  aspectRatio="1:1"
  objectFit="contain"
/>

// Image with custom fallback
<Image
  src={post.coverImage}
  alt={post.title}
  aspectRatio="4:3"
  fallbackText="No cover image available"
/>
```

#### Features

- **Lazy Loading**: Native `loading="lazy"` attribute
- **Async Decoding**: `decoding="async"` for non-blocking rendering
- **Loading Skeleton**: Animated pulse while loading
- **Error State**: Broken image icon and custom fallback text
- **Aspect Ratio**: CSS `aspect-ratio` for layout stability
- **Smooth Transitions**: Fade-in on load
- **Performance**: Optimized for Core Web Vitals (LCP)

#### States

- **Loading**: Gray skeleton with pulse animation
- **Loaded**: Smooth fade-in transition
- **Error**: Red icon with fallback message

---

### ConfirmDialog

**Location**: `src/components/ui/ConfirmDialog.tsx`

Modal confirmation dialog for destructive actions.

#### Props

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  loading?: boolean;
}
```

#### Usage Examples

```tsx
// Basic confirmation dialog
<ConfirmDialog
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  onConfirm={handleDelete}
  title="Delete Post"
  description="Are you sure you want to delete this post? This action cannot be undone."
/>

// Destructive action with custom text
<ConfirmDialog
  isOpen={showDeleteDialog}
  onClose={handleCancel}
  onConfirm={handleDeleteConfirm}
  title="Delete Project"
  description="This will permanently delete the project and all associated data."
  confirmText="Delete Forever"
  cancelText="Keep Project"
  destructive={true}
/>

// Loading state during action
<ConfirmDialog
  isOpen={dialogOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Publish All Posts"
  description="This will publish 15 draft posts immediately."
  loading={isPublishing}
/>
```

#### Features

- **Portal Rendering**: Renders outside normal DOM hierarchy
- **Focus Management**: Auto-focuses confirm button
- **Keyboard Support**: Escape key to cancel
- **Backdrop Click**: Click outside to cancel
- **Loading State**: Disables buttons during async operations
- **Destructive Variant**: Red styling for dangerous actions
- **Accessibility**: Proper ARIA attributes

#### Accessibility

- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` linked to title
- `aria-describedby` linked to description
- Focus trap within dialog
- Escape key handler

---

### Search

**Location**: `src/components/ui/Search.tsx`

Real-time search component with fuzzy matching and result highlighting.

#### Props

```typescript
interface SearchProps {
  placeholder?: string;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}
```

#### Usage Examples

```tsx
// Basic search in header
<Search
  placeholder="Search posts, projects, notes..."
  onResultClick={(result) => navigate(result.url)}
/>

// Styled search with custom className
<Search
  className="max-w-md"
  placeholder="Find content..."
/>
```

#### Features

- **Fuzzy Search**: Powered by Fuse.js
- **Multi-Collection**: Searches posts, projects, articles, notes
- **Real-time Results**: Instant feedback as user types
- **Result Highlighting**: Matched terms highlighted
- **Keyboard Navigation**: Arrow keys + Enter
- **Category Badges**: Visual type indicators
- **Click Outside**: Auto-close on blur
- **Debouncing**: Optimized performance (300ms delay)

#### Search Configuration

```typescript
// Fuse.js options
threshold: 0.3,        // 70% similarity required
keys: [
  'title',             // Weight: 1.0
  'summary',           // Weight: 0.8
  'description',       // Weight: 0.8
  'tags',              // Weight: 0.6
  'technologies'       // Weight: 0.6
]
```

---

## Editor Components

### MarkdownEditor

**Location**: `src/components/editor/MarkdownEditor.tsx`

Rich Markdown editor with live preview and syntax highlighting.

#### Props

```typescript
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}
```

#### Usage Examples

```tsx
// Basic markdown editor
<MarkdownEditor
  value={postBody}
  onChange={(value) => setPostBody(value)}
  placeholder="Write your post content in Markdown..."
/>

// Custom height
<MarkdownEditor
  value={noteContent}
  onChange={setNoteContent}
  height="300px"
/>
```

#### Features

- **Live Preview**: Side-by-side editor and preview
- **Syntax Highlighting**: Code blocks with language detection
- **Markdown Rendering**: Headings, lists, links, images, code
- **Responsive**: Stacked on mobile, side-by-side on desktop
- **Textarea**: Native HTML textarea for accessibility
- **Custom Styling**: Tailwind-based preview styles

#### Supported Markdown

- Headings: `# H1` through `###### H6`
- Bold: `**bold**`
- Italic: `*italic*`
- Links: `[text](url)`
- Images: `![alt](url)`
- Lists: `- item` or `1. item`
- Code: `` `inline` `` or ` ```language\nblock\n``` `
- Blockquotes: `> quote`
- Horizontal rules: `---`

---

## Accessibility Components

### SkipNav

**Location**: `src/components/accessibility/SkipNav.tsx`

Skip navigation link for keyboard users (WCAG 2.4.1 compliance).

#### Props

None - automatically targets `#main-content`.

#### Usage Examples

```tsx
// Add to App.tsx before header
<SkipNav />
<Header />
<main id="main-content">
  {/* Page content */}
</main>

// Component is screen-reader only by default
// Becomes visible on keyboard focus
```

#### Features

- **WCAG 2.4.1**: Bypass Blocks compliance
- **Screen Reader Only**: Hidden until focused
- **Keyboard Visible**: Shows on Tab focus
- **High Contrast**: Focus ring for visibility
- **High Z-index**: Always on top when focused
- **Automatic Target**: Links to `#main-content` ID

#### Styling

- Hidden: `sr-only` class (position: absolute, width: 1px)
- Focused: Full width, visible, high z-index
- Colors: White background, primary text, primary focus ring

---

### LiveRegion

**Location**: `src/components/accessibility/LiveRegion.tsx`

ARIA live region for dynamic content announcements to screen readers.

#### Components

- **LiveRegion**: Container component
- **useLiveAnnouncement**: Hook for programmatic announcements

#### Props

```typescript
interface LiveRegionProps {
  message?: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number; // milliseconds
}
```

#### Usage Examples

```tsx
// Add to App.tsx
import { LiveRegion } from '@/components/accessibility/LiveRegion';

function App() {
  return (
    <>
      <LiveRegion />
      {/* Rest of app */}
    </>
  );
}

// Use hook in components
import { useLiveAnnouncement } from '@/components/accessibility/LiveRegion';

function PostEditor() {
  const announce = useLiveAnnouncement();

  const handleSave = async () => {
    await savePost();
    announce('Post saved successfully');
  };

  const handlePublish = async () => {
    await publishPost();
    announce('Post published', 'assertive');
  };
}
```

#### Features

- **ARIA Live Region**: Proper `aria-live` attribute
- **Politeness Levels**:
  - `polite`: Wait for pause in speech (default)
  - `assertive`: Interrupt current speech
- **Auto-clear**: Messages clear after timeout (default: 5s)
- **Screen Reader Only**: Visually hidden
- **Global Hook**: Use from any component
- **Queue Support**: Multiple announcements queued

#### Common Use Cases

- Form submission success/error
- Content save confirmations
- Dynamic content updates
- Filter/search result counts
- Loading state changes

---

## Feature Components

### PreviewMode

**Location**: `src/components/PreviewMode.tsx`

Preview banner and utilities for viewing unpublished content.

#### Components

- **PreviewMode**: Visual banner component
- **usePreviewMode**: Hook for preview state
- **GeneratePreviewLink**: Admin utility for creating preview URLs

#### Props

```typescript
// PreviewMode
interface PreviewModeProps {
  isPublished: boolean;
  itemType: 'post' | 'note' | 'project' | 'article';
}

// GeneratePreviewLink
interface GeneratePreviewLinkProps {
  itemId: string;
  itemType: 'post' | 'note' | 'project' | 'article';
}
```

#### Usage Examples

```tsx
// Add to content detail pages
function BlogPost() {
  const { post } = usePost();

  return (
    <>
      <PreviewMode isPublished={post.published} itemType="post" />
      <article>{/* Post content */}</article>
    </>
  );
}

// Use hook for conditional rendering
function ProjectDetail() {
  const { project } = useProject();
  const { canViewUnpublished } = usePreviewMode();

  if (!project.isVisible && !canViewUnpublished) {
    return <NotFound />;
  }

  return <div>{/* Project details */}</div>;
}

// Generate preview link in admin
function PostEditor({ post }) {
  return (
    <div>
      {!post.published && (
        <GeneratePreviewLink itemId={post.id} itemType="post" />
      )}
    </div>
  );
}
```

#### Features

- **URL Parameters**: `?preview=true&token=abc123`
- **Token Generation**: Random 32-character tokens
- **Expiration**: 7-day validity
- **Copy to Clipboard**: One-click preview URL copying
- **Visual Banner**: Yellow warning banner for preview mode
- **Exit Preview**: Button to clear preview params

#### Hook Return Values

```typescript
const {
  isPreviewMode,        // boolean
  previewToken,         // string | null
  canViewUnpublished    // boolean
} = usePreviewMode();
```

---

### BulkActions

**Location**: `src/admin/BulkActions.tsx`

Bulk content management operations for admin panels.

#### Components

- **BulkActions**: Main floating action bar
- **BulkSelectionCheckbox**: Individual item checkbox
- **BulkSelectionHeader**: Select all/none controls

#### Props

```typescript
interface BulkActionsProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  collectionType: 'posts' | 'notes' | 'projects' | 'articles';
  onComplete?: () => void;
}

interface BulkSelectionCheckboxProps {
  id: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

interface BulkSelectionHeaderProps {
  allIds: string[];
  selectedIds: string[];
  onSelectAll: () => void;
  onSelectNone: () => void;
}
```

#### Usage Examples

```tsx
// In admin manager components
function PostsManager() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <>
      <BulkSelectionHeader
        allIds={posts.map(p => p.id)}
        selectedIds={selectedIds}
        onSelectAll={() => setSelectedIds(posts.map(p => p.id))}
        onSelectNone={() => setSelectedIds([])}
      />

      {posts.map(post => (
        <div key={post.id}>
          <BulkSelectionCheckbox
            id={post.id}
            checked={selectedIds.includes(post.id)}
            onToggle={(id) => {/* toggle logic */}}
          />
          {/* Post item */}
        </div>
      ))}

      <BulkActions
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        collectionType="posts"
        onComplete={() => {
          setSelectedIds([]);
          fetchPosts();
        }}
      />
    </>
  );
}
```

#### Features

- **Multi-select**: Checkbox selection for items
- **Select All/None**: Bulk selection controls
- **Floating Action Bar**: Appears when items selected
- **Operations**:
  - Bulk Publish/Unpublish
  - Bulk Delete (with confirmation)
  - Bulk Tag Assignment
  - Bulk Export (CSV/JSON)
- **Confirmation Dialogs**: Destructive actions require confirmation
- **Loading States**: Disabled during operations
- **Auto-clear**: Selection clears after completion

#### Supported Collection Types

- **posts**: Published field
- **notes**: isVisible field
- **projects**: isVisible field
- **articles**: isVisible field

---

### SEOHead

**Location**: `src/components/SEOHead.tsx`

Dynamic meta tags for SEO and social sharing.

#### Props

```typescript
interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  noindex?: boolean;
}
```

#### Usage Examples

```tsx
// Homepage
<SEOHead
  title="Scott Kunian - Full Stack Developer"
  description="Personal website and blog of Scott Kunian, featuring web development projects and technical articles."
  keywords={['web development', 'React', 'TypeScript', 'Firebase']}
/>

// Blog post
<SEOHead
  title={post.title}
  description={post.summary}
  keywords={post.tags}
  ogImage={post.coverImage}
  ogType="article"
  article={{
    publishedTime: post.createdAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: 'Scott Kunian',
    tags: post.tags
  }}
/>

// Draft content (no indexing)
<SEOHead
  title="Preview: Draft Post"
  noindex={true}
/>
```

#### Generated Tags

**Basic Meta Tags**:
- `<title>`
- `<meta name="description">`
- `<meta name="keywords">`
- `<meta name="robots">`

**OpenGraph Tags**:
- `og:title`
- `og:description`
- `og:image`
- `og:url`
- `og:type`
- `og:site_name`
- `article:published_time`
- `article:modified_time`
- `article:author`
- `article:tag`

**Twitter Card Tags**:
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`
- `twitter:creator`

#### Default Values

- Site Name: "ScottKunian.com"
- Default Image: "/og-image.png"
- Twitter Card: "summary_large_image"
- Twitter Handle: "@scottkunian"

---

## Authentication Components

### ProtectedRoute

**Location**: `src/components/auth/ProtectedRoute.tsx`

Route wrapper requiring authentication.

#### Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

#### Usage Examples

```tsx
// Wrap admin routes
<Route
  path="/admin/*"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

#### Features

- Checks Firebase auth state
- Redirects to `/admin/login` if not authenticated
- Loading state while checking auth
- Preserves intended destination for post-login redirect

---

### AdminRoute

**Location**: `src/components/auth/ProtectedRoute.tsx`

Route wrapper requiring admin role via Firebase custom claims.

#### Props

```typescript
interface AdminRouteProps {
  children: React.ReactNode;
}
```

#### Usage Examples

```tsx
// Wrap admin panel
<Route
  path="/admin/*"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```

#### Features

- Checks Firebase auth state
- Verifies `admin: true` custom claim
- Shows "Access Denied" for authenticated non-admins
- Redirects to `/admin/login` if not authenticated
- Loading state while checking auth and claims
- Token refresh support for updated claims

#### Access Denied UI

```tsx
<Card>
  <CardHeader>
    <CardTitle>Access Denied</CardTitle>
  </CardHeader>
  <CardContent>
    <p>You do not have permission to access the admin panel.</p>
    <p>Please contact the site administrator if you believe this is an error.</p>
  </CardContent>
  <CardFooter>
    <Button onClick={() => navigate('/')}>Return Home</Button>
  </CardFooter>
</Card>
```

---

## Component Best Practices

### Importing Components

```tsx
// UI Components
import { Button, Card, Input, Badge } from '@/components/ui';

// Or individual imports
import { Button } from '@/components/ui/Button';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { SkipNav } from '@/components/accessibility/SkipNav';
```

### Styling Components

All components use Tailwind CSS and accept `className` prop for customization:

```tsx
<Button className="mt-4 w-full">
  Custom Styled Button
</Button>

<Card className="hover:shadow-xl transition-shadow duration-300">
  Interactive Card
</Card>
```

### TypeScript Usage

All components are fully typed with TypeScript. Import types when needed:

```tsx
import type { ButtonProps } from '@/components/ui/Button';
import type { SearchResult } from '@/components/ui/Search';
```

### Accessibility Considerations

- Always provide `alt` text for images
- Use `aria-label` for icon-only buttons
- Provide `label` prop for inputs
- Use semantic HTML elements
- Test keyboard navigation
- Verify screen reader compatibility

### Performance Tips

- Use `Image` component instead of `<img>` for lazy loading
- Implement route-based code splitting for large components
- Memoize expensive computations
- Use React.memo for frequently re-rendered components

---

## Component Checklist

When creating new components, ensure:

- [ ] TypeScript interface defined for props
- [ ] Default props documented
- [ ] Accessibility attributes included
- [ ] Keyboard navigation supported
- [ ] Focus management implemented
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Responsive design implemented
- [ ] Dark mode compatible (if applicable)
- [ ] Unit tests written
- [ ] Storybook story created (if applicable)
- [ ] Documentation added to this file

---

## Contributing

When adding new components:

1. Follow existing naming conventions
2. Use TypeScript for type safety
3. Include comprehensive prop documentation
4. Add usage examples
5. Update this documentation file
6. Write tests for complex logic
7. Ensure accessibility compliance

For questions or suggestions, contact [@scottkunian](https://github.com/scottkunian).
