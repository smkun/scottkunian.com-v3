# Firebase Deployment Guide

## Quick Deployment

```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# View deployment
firebase hosting:channel:open live
```

## Full Deployment (All Services)

```bash
# Deploy everything
firebase deploy

# Or deploy selectively
firebase deploy --only hosting,firestore:rules,storage:rules
```

## Rollback

```bash
# List deployments
firebase hosting:channel:list

# Rollback to previous
firebase hosting:rollback
```

## CI/CD (GitHub Actions)

Push to `main` branch triggers automatic deployment via `.github/workflows/firebase-hosting.yml`

**Document Created**: 2025-10-05
