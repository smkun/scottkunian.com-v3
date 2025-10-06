# Scripts Directory

Utility scripts for managing the ScottKunian.com website.

## Image Optimization

### `optimizeImages.cjs`

Converts PNG/JPG images to WebP format for better performance.

**Usage:**
```bash
npm run optimize:images
```

**What it does:**
- Finds all `.png` and `.jpg` files in `/public/images/articles/`
- Converts them to `.webp` format with 85% quality
- Deletes the original files
- Shows size savings (typically 90-95% reduction!)

**Example output:**
```
✅ 1.png → 1.webp
📉 762.41 KB → 74.06 KB (saved 90.3%)
🗑️  Deleted original: 1.png
```

**Requirements:**
- Automatically installs `sharp` package if not present

**When to use:**
- After adding new article images
- Before deploying to production
- When images are too large

## Admin Setup

### `setAdminClaim.cjs`

Sets admin custom claim for Firebase authentication.

**Usage:**
```bash
node scripts/setAdminClaim.cjs
```

**What it does:**
- Grants admin access to scottkunian@gmail.com
- Sets `admin: true` custom claim in Firebase Auth
- Required for accessing admin panel

**Requirements:**
- `firebase-service-account.json` in project root
- Firebase Admin SDK installed

**When to use:**
- First-time admin setup
- Adding new admin users

## Project Import Scripts

### `importOldSiteProjects.cjs`
Imports GitHub code collection projects from OLD_SITE.

### `importLiveGames.cjs`
Imports live playable games/apps from OLD_SITE.

### `add32Gamers.cjs`
Adds 32 Gamers gaming club website.

### `update802SoulKitchen.cjs`
Updates 802 Soul Kitchen technology stack.

**Usage:**
```bash
node scripts/[script-name].cjs
```

**When to use:**
- Initial project setup
- Migrating content from old site
- Updating project metadata
