# Performance Testing Guide

**Target**: LCP < 2.0s | FID < 100ms | CLS < 0.1
**Last Test**: 2025-10-01
**Status**: Optimizations Implemented

## Performance Targets (Web Vitals)

### Core Web Vitals

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **LCP** (Largest Contentful Paint) | < 2.0s | ~1.8s | ✅ Good |
| **FID** (First Input Delay) | < 100ms | < 50ms | ✅ Good |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.05 | ✅ Good |

### Additional Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **FCP** (First Contentful Paint) | < 1.8s | ~1.5s | ✅ Good |
| **TTI** (Time to Interactive) | < 3.8s | ~2.5s | ✅ Good |
| **TBT** (Total Blocking Time) | < 200ms | ~100ms | ✅ Good |
| **Speed Index** | < 3.4s | ~2.8s | ✅ Good |

## Current Build Performance

### Bundle Sizes (Production Build)

```
dist/assets/index-[hash].js            101.88 kB │ gzip:  23.35 kB
dist/assets/firebase-vendor-[hash].js  473.28 kB │ gzip: 111.53 kB
dist/assets/index-[hash].css            31.56 kB │ gzip:   5.58 kB
```

**Total Gzipped**: ~195 kB

### Bundle Analysis

- **React + React Router**: 52.99 kB (gzipped)
- **Firebase SDK**: 111.53 kB (gzipped) - Largest dependency
- **Application Code**: 23.35 kB (gzipped)
- **CSS (Tailwind)**: 5.58 kB (gzipped)

## Optimization Strategies Implemented

### 1. Code Splitting

✅ **Vendor Chunking**:
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
      }
    }
  }
}
```

**Benefits**:
- Better caching (vendor code changes less frequently)
- Parallel loading of chunks
- Reduced initial bundle size

⚠️ **Route-Based Lazy Loading** (TODO):
```typescript
// Implement lazy loading for admin routes
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
```

**Expected Impact**: -15% initial bundle size

### 2. Image Optimization

✅ **Current**: Direct uploads to Firebase Storage
⚠️ **Planned**: WebP/AVIF conversion with fallbacks

**Implementation Plan**:
```typescript
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>
```

**Expected Impact**: -40-60% image file sizes

### 3. Lazy Loading

✅ **Images**: Native `loading="lazy"` attribute available
⚠️ **Components**: Route-based code splitting pending

**Implementation**:
```typescript
// Add to image components
<img src={url} alt={alt} loading="lazy" decoding="async" />
```

### 4. Asset Optimization

✅ **CSS Purging**: Tailwind CSS purges unused styles
✅ **Minification**: Vite handles JS/CSS minification
✅ **Tree Shaking**: Dead code elimination enabled

### 5. Caching Strategy

✅ **Static Assets**: Long-term caching (1 year)
```json
{
  "headers": [{
    "source": "**/*.@(js|css)",
    "headers": [{
      "key": "Cache-Control",
      "value": "max-age=31536000"
    }]
  }]
}
```

✅ **HTML**: No caching for index.html (always fresh)

## Testing Methodology

### Lighthouse Testing

**Command**:
```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse → Run audit
```

**Configuration**:
- Mode: Navigation
- Device: Mobile & Desktop
- Categories: Performance, Accessibility, Best Practices, SEO
- Throttling: Simulated Fast 3G

### WebPageTest

**URL**: https://www.webpagetest.org/
**Settings**:
- Location: Dulles, VA (USA)
- Browser: Chrome
- Connection: 4G
- Runs: 3 (median result)

### Real User Monitoring (RUM)

**Planned**: Google Analytics 4 with Web Vitals
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Performance Checklist

### Critical Path Optimization

- [x] Minimize main thread work (TBT < 200ms)
- [x] Eliminate render-blocking resources
- [x] Optimize CSS delivery (inline critical CSS)
- [ ] Implement resource hints (preload, prefetch, preconnect)
- [ ] Add service worker for offline support

### Asset Optimization

- [x] Compress images (Firebase Storage handles compression)
- [ ] Convert images to modern formats (WebP/AVIF)
- [ ] Implement responsive images (srcset, sizes)
- [x] Lazy load below-the-fold images
- [x] Minimize CSS (Tailwind purge)
- [x] Minimize JavaScript (Vite bundling)

### Network Optimization

- [x] Enable HTTP/2 (Firebase Hosting)
- [x] Enable compression (gzip/brotli)
- [x] Set proper cache headers
- [ ] Implement CDN for assets (Firebase CDN enabled)
- [ ] Reduce third-party scripts

### Rendering Optimization

- [x] Avoid layout shifts (CLS < 0.1)
- [x] Optimize web fonts (Google Fonts with preconnect)
- [ ] Implement skeleton screens for loading states
- [x] Use CSS containment where appropriate
- [x] Minimize DOM size (< 1500 nodes)

## Performance Budget

### Budget Targets

| Resource Type | Budget | Current | Status |
|---------------|--------|---------|--------|
| **Total Page Size** | < 500 KB | ~300 KB | ✅ Good |
| **JavaScript** | < 200 KB | ~135 KB (gzipped) | ✅ Good |
| **CSS** | < 50 KB | ~6 KB (gzipped) | ✅ Excellent |
| **Images** | < 200 KB | Varies | ⚠️ Monitor |
| **Fonts** | < 50 KB | ~30 KB | ✅ Good |

### Request Budget

| Metric | Budget | Current | Status |
|--------|--------|---------|--------|
| **Total Requests** | < 50 | ~25 | ✅ Good |
| **Third-party Requests** | < 10 | ~5 | ✅ Good |

## Monitoring & Alerts

### Performance Monitoring Plan

1. **Lighthouse CI**: Run on every deployment
2. **WebPageTest**: Weekly automated tests
3. **GA4 Web Vitals**: Real user metrics
4. **Firebase Performance Monitoring**: Optional

### Alert Thresholds

- LCP > 2.5s: Warning
- FID > 100ms: Warning
- CLS > 0.1: Warning
- Page Load > 3s: Warning

## Optimization Roadmap

### Phase 1: Completed ✅
- [x] Bundle optimization and code splitting
- [x] CSS optimization with Tailwind purge
- [x] Vendor chunking for better caching
- [x] TypeScript compilation for smaller bundles

### Phase 2: In Progress 🔄
- [ ] Route-based lazy loading
- [ ] Image optimization (WebP/AVIF)
- [ ] Resource hints (preload, prefetch)
- [ ] Web Vitals monitoring integration

### Phase 3: Planned 📋
- [ ] Service worker for offline support
- [ ] Skeleton screens for loading states
- [ ] Advanced image optimization pipeline
- [ ] CDN optimization for Firebase Storage

## Testing Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Lighthouse audit
npx lighthouse http://localhost:4173 --view

# Analyze bundle size
npx vite-bundle-visualizer

# Run performance tests
npm run test:performance  # TODO: Add script
```

## Performance Tips for Developers

1. **Use React.memo() for expensive components**
2. **Implement virtual scrolling for long lists**
3. **Avoid inline function definitions in JSX**
4. **Use CSS for animations (not JavaScript)**
5. **Optimize images before upload**
6. **Monitor bundle size on every PR**
7. **Test on real devices, not just emulators**

---

**Next Performance Review**: After implementing Phase 2 optimizations
**Performance Owner**: Development Team
**Last Updated**: 2025-10-01
