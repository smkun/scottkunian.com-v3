# iFastNet Deployment Guide

## Quick Summary

✅ **Images in `/public/images/articles/`** get automatically copied to `dist/images/articles/` during build
✅ **Upload entire `dist/` folder** to iFastNet - images included!
⚠️ **New images** require rebuild + redeploy (or manual FTP upload)

## Deployment Steps

### 1. Build for Production

```bash
npm run build
```

This creates `dist/` folder with:
- Your React app
- All images from `/public/` (including articles!)
- Optimized assets

### 2. Upload to iFastNet

**Via FTP (FileZilla, WinSCP):**
1. Connect to iFastNet FTP server
2. Navigate to `htdocs/` or `public_html/`
3. Upload **contents** of `dist/` folder
4. Result on server:
   ```
   htdocs/
   ├── index.html
   ├── assets/
   └── images/
       └── articles/    ← Your images are here!
   ```

**Via File Manager:**
1. Zip the `dist/` folder contents
2. Upload to iFastNet File Manager
3. Extract in `htdocs/`

### 3. Add New Article Images Later

**Option A: Full Redeploy**
1. Add image to `/public/images/articles/`
2. Run `npm run build`
3. Upload new `dist/` to iFastNet

**Option B: Manual Upload (Faster)**
1. Add image to `/public/images/articles/`
2. FTP upload just that image to `htdocs/images/articles/`
3. No rebuild needed!

## Alternative: Use Firebase Storage

If you upgrade to Blaze plan (free within limits, requires credit card):

**Benefits:**
- No manual image uploads
- Images served from Firebase CDN
- Automatic optimization
- Upload directly from admin panel

**Cost:** $0.00/month for your traffic (5GB storage free, 1GB/day downloads free)

See `ENABLE_STORAGE.md` for setup instructions.

## Recommendation

**For Now:** Stick with `/public/` folder
- Simple and free
- Works great for development
- Easy to migrate to Firebase Storage later if needed

**When to Switch:**
- When manual uploads become annoying
- When you want automatic CDN performance
- When you're comfortable adding a credit card to Firebase
