# Quick Fix: Firebase Storage CORS Configuration

## Problem
Images fail to upload with CORS error: "Access to XMLHttpRequest has been blocked by CORS policy"

## Solution (5 minutes)

### Step 1: Open Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Sign in with scottkunian@gmail.com
3. Select project: **scottkunian-website**

### Step 2: Navigate to Cloud Storage
1. Click the hamburger menu (☰) in top-left
2. Select **Cloud Storage** → **Buckets**
3. You should see: `scottkunian-website.firebasestorage.app`

### Step 3: Configure CORS
1. Click on the bucket name: `scottkunian-website.firebasestorage.app`
2. Click the **CONFIGURATION** tab at the top
3. Scroll down to **CORS configuration**
4. Click **EDIT**
5. Paste this JSON:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

6. Click **SAVE**

### Step 4: Test
1. Go back to your admin panel: http://localhost:3000/admin/articles
2. Try uploading an image
3. Should work without CORS errors!

## Alternative: Command Line (If you have gcloud SDK)

```bash
# Install Google Cloud SDK first
# Then run:
gsutil cors set storage.cors.json gs://scottkunian-website.firebasestorage.app

# Verify it worked:
gsutil cors get gs://scottkunian-website.firebasestorage.app
```

## For Production Later

When you deploy to production, add your production domain:

```json
[
  {
    "origin": ["https://scottkunian.com", "https://www.scottkunian.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## Troubleshooting

**Q: I don't see the bucket in Cloud Storage**
- A: Make sure you're signed in with the correct Google account (scottkunian@gmail.com)
- A: Make sure you selected the correct project (scottkunian-website)

**Q: I saved CORS but it's still not working**
- A: Clear your browser cache (Ctrl+Shift+Delete)
- A: Hard reload the page (Ctrl+Shift+R)
- A: Wait 1-2 minutes for changes to propagate

**Q: I get "permission denied" when trying to edit**
- A: Make sure you're the owner of the Firebase project
- A: Check that you're signed in with the correct account

## What This Does

CORS (Cross-Origin Resource Sharing) tells Firebase Storage:
- "Allow uploads from localhost during development"
- "Allow these HTTP methods: GET, PUT, POST, DELETE"
- "Cache this permission for 1 hour"

Without CORS, browsers block uploads from localhost to firebasestorage.googleapis.com for security reasons.
