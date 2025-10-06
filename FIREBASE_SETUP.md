# Firebase Setup Guide

## Status: ✅ Configuration Ready

Your Firebase credentials have been configured! Follow these steps to complete the setup.

## Project Details
- **Project Name**: ScottKunian-Website
- **Project ID**: scottkunian-website
- **Configuration**: ✅ Added to `.env` file

## Required Setup Steps

### 1. Login to Firebase CLI
```bash
firebase login
```

### 2. Set Firebase Project
```bash
firebase use scottkunian-website
```

### 3. Enable Firebase Services

Visit your Firebase Console: https://console.firebase.google.com/project/scottkunian-website

#### Enable Firestore Database:
1. Go to **Firestore Database** in sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"**
4. Select location: **us-central1** (recommended)
5. Click **"Done"**

#### Enable Firebase Storage:
1. Go to **Storage** in sidebar
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Use same location as Firestore
5. Click **"Done"**

#### Enable Authentication:
1. Go to **Authentication** in sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Google** provider:
   - Click on Google
   - Toggle **"Enable"**
   - Add your email as support email
   - Click **"Save"**

### 4. Deploy Firebase Configuration
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Test the Application
```bash
npm run dev
```

Visit: http://localhost:5173/admin/login

## What's Configured

### ✅ Environment Variables
- Firebase API keys and configuration in `.env`

### ✅ Security Rules
- **Firestore Rules**: Admin-only write access, public read for published content
- **Storage Rules**: Admin-only write access for images

### ✅ Database Indexes
- Optimized queries for posts, notes, projects, and articles

### ✅ Application Features
- Admin authentication with Google
- Content management for posts and notes
- Image upload to Firebase Storage
- Public blog with markdown rendering
- Syntax highlighting for code blocks

## Admin Access

After completing the setup:
1. Go to `/admin/login`
2. Sign in with Google
3. Access the admin panel at `/admin`

## Troubleshooting

### If deployment fails:
- Check that all services are enabled in Firebase Console
- Verify you're logged in: `firebase whoami`
- Verify project selection: `firebase use --list`

### If admin login doesn't work:
- Check Authentication is enabled with Google provider
- Verify your Google account is the one used to create the project

## Next Steps

After Firebase setup is complete:
1. Create your first blog post in `/admin/posts/new`
2. Add some field notes in `/admin/notes/quick`
3. Test the public blog at `/blog`

## Files Ready for Deployment
- `firestore.rules` - Database security rules
- `firestore.indexes.json` - Database performance indexes
- `storage.rules` - File storage security rules
- `firebase.json` - Project configuration
- `.env` - Environment variables (keep private!)

---

**Ready to deploy!** 🚀 Follow the steps above and your website will be fully functional.