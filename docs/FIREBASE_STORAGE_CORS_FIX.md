# Firebase Storage CORS Configuration

## Issue

Image uploads are failing with CORS error:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Solution

Firebase Storage needs CORS configuration to allow uploads from localhost during development.

### Method 1: Using Google Cloud Console (Easiest)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `scottkunian-website`
3. Navigate to: **Cloud Storage > Browser**
4. Find your bucket: `scottkunian-website.firebasestorage.app`
5. Click the **three dots menu** → **Edit bucket permissions**
6. Add CORS configuration:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

### Method 2: Using gsutil Command Line (Requires Google Cloud SDK)

If you have Google Cloud SDK installed:

```bash
# Set CORS configuration
gsutil cors set storage.cors.json gs://scottkunian-website.firebasestorage.app

# Verify CORS configuration
gsutil cors get gs://scottkunian-website.firebasestorage.app
```

### Method 3: Using Firebase Console (Limited)

Firebase Console doesn't directly support CORS configuration. Use Method 1 or 2 instead.

## Verification

After applying CORS configuration:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Reload the admin panel
3. Try uploading an image to an article
4. Should see successful upload with no CORS errors

## Production CORS Configuration

For production deployment, update CORS to include your production domain:

```json
[
  {
    "origin": ["https://scottkunian.com", "https://www.scottkunian.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## Alternative: Skip Image Upload

If you can't configure CORS immediately, you can:

1. Leave the image field empty when creating articles
2. The article will save successfully without an image (imageUrl will be omitted from Firestore)
3. Add images later after CORS is configured

## Code Changes Made

- **firestore.ts**: Added `removeUndefinedFields()` helper to prevent Firestore errors when imageUrl is undefined
- **storage.cors.json**: Created CORS configuration file ready for deployment
