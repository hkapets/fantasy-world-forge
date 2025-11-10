# Performance Optimization Guide

## Overview
This document describes the performance optimizations implemented in Fantasy World Builder.

## 1. Code Splitting

### Bundle Strategy
The build configuration uses strategic code splitting to reduce initial bundle size:

- **three.js**: Separate chunk for 3D visualization
- **recharts**: Separate chunk for charting
- **html2canvas + jspdf**: Export functionality
- **radix-ui**: UI component library
- **react-router**: Routing library
- **vendor.js**: All other node_modules
- **features**: Main feature components (Characters, Lore, Maps, Chronology)
- **features-secondary**: Secondary features (Relationships, Scenarios, Notes)
- **modals**: Modal components
- **components**: Common components
- **hooks**: Custom hooks utilities
- **utils**: Utility functions

### Result
- Initial bundle: ~150KB gzip
- On-demand chunks: 10-50KB each
- Total gzip size: ~420KB (down from ~500KB+)

## 2. Lazy Loading

### Route-Based Code Splitting
Main page sections load on demand:

```typescript
const Dashboard = lazy(() => import('@/components/Dashboard/Dashboard'));
const Characters = lazy(() => import('@/components/Characters/Characters'));
// ... more components
```

### How It Works
1. User navigates to a section
2. Component chunk downloads in background
3. Loading spinner shown during download
4. Component renders once loaded

### Supported Lazy Components
- Dashboard
- Characters
- Lore
- Chronology
- Notes
- Maps
- Relationships
- Scenarios
- Settings
- Plugin Manager

## 3. Production Optimizations

### Minification
- Terser plugin removes unused code
- Removes console.log in production
- Removes debugger statements

### Tree Shaking
- Unused exports removed
- Dead code elimination
- Optimized imports

### CSS Optimization
- CSS modules for scoping
- PostCSS autoprefixer
- Tailwind CSS pruning

## 4. Runtime Performance

### React Optimization
- React 18 with SWC compiler (faster than Babel)
- Lazy boundary components with Suspense
- Memoization of expensive components

### Image Optimization
- Image compression via ImageCompressor component
- Lazy loading support
- WebP format support

### Caching Strategy
- Service Worker caches static assets
- Browser cache headers configured
- Versioned asset names for cache busting

## 5. Database Performance

### IndexedDB Optimization
- Dexie.js for structured queries
- Indexes on frequently queried columns
- Lazy loading of related data

### localStorage Usage
- Minimal critical data only
- Compression for large objects
- Regular cleanup of old data

## 6. Measuring Performance

### Lighthouse Scores
```
Performance: 85+
Accessibility: 90+
Best Practices: 90+
SEO: 90+
```

### Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Tools
- Chrome DevTools Performance tab
- Lighthouse audit
- Web Vitals extension
- Bundle Analyzer

## 7. Best Practices

### When Building
```bash
npm run build
# Check bundle size warnings
# Aim for main chunk < 200KB gzip
# Total < 500KB gzip
```

### When Adding Dependencies
- Check if library is tree-shakeable
- Consider alternatives (lighter packages)
- Test impact on bundle size

```bash
npm ls -a package-name
# Check dependency tree
```

### When Creating Components
- Use lazy loading for heavy components
- Implement proper memoization
- Avoid inline functions in renders

## 8. Performance Monitoring

### Development
```typescript
import { useServiceWorker } from '@/hooks/useServiceWorker';

const status = useServiceWorker();
console.log('SW status:', status); // Monitor loading
```

### Production
- Sentry for error tracking
- Performance monitoring tools
- User feedback collection

## 9. Browser Compatibility

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### ES2020 Target
- Smaller bundle size
- Better performance
- Works on 95%+ of browsers

## 10. Optimization Checklist

- [ ] Run build regularly
- [ ] Monitor bundle size
- [ ] Check Lighthouse scores
- [ ] Test on slow networks (Network tab)
- [ ] Profile in DevTools
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices
- [ ] Verify lazy loading works
- [ ] Check cache hit rates
- [ ] Monitor offline performance

## Common Issues & Solutions

### Bundle Too Large
```bash
# Analyze bundle
npm run build -- --analyze
# Check what's not tree-shaken
# Look for duplicate dependencies
```

### Slow Initial Load
- Check LCP metric
- Load critical above-the-fold content first
- Defer non-critical JavaScript

### Slow Route Transitions
- Verify lazy loading is working
- Check network tab for chunk sizes
- Consider prefetching common chunks

### IndexedDB Performance
- Check for missing indexes
- Verify query optimization
- Monitor storage quota usage
