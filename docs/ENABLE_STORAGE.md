# Enable Firebase Storage (First Time Setup)

## Issue
Firebase Storage bucket not visible in Google Cloud Console because Storage hasn't been fully initialized yet.

## Solution: Enable Storage via Firebase Console

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Sign in with scottkunian@gmail.com
3. Click on your project: **ScottKunian-Website** (scottkunian-website)

### Step 2: Enable Storage (Requires Blaze Plan Upgrade)
1. In the left sidebar, click **Build** to expand it
2. Click **Storage**
3. You should see "Get Started" button
4. Click **Get Started**
5. **You'll see a message: "To use Storage, upgrade your project's billing plan"**
6. Click **Upgrade to Blaze plan**
7. **Add a credit card** (required, but you won't be charged within free tier limits)
8. Set a **budget alert** at $5/month for safety
9. After upgrading, return to Storage and click **Get Started** again
10. Select location: **us-central** (or closest to you)
11. Click **Done**

### Step 3: Verify Storage is Created
Wait 30 seconds, then you should see:
- A "Files" tab showing your storage bucket
- The bucket URL: `gs://scottkunian-website.firebasestorage.app`

### Step 4: Configure CORS via Firebase Console

Unfortunately, Firebase Console doesn't have a direct CORS editor. You need to use Google Cloud Console.

Once Storage is enabled in Firebase Console, go to:

1. https://console.cloud.google.com/storage/browser
2. Sign in with same account (scottkunian@gmail.com)
3. You should now see: `scottkunian-website.firebasestorage.app`
4. Click on the bucket name
5. Click **CONFIGURATION** tab
6. Scroll to **CORS configuration**
7. Click **EDIT**
8. Paste:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

9. Click **SAVE**

### Step 5: Test Image Upload
1. Go back to admin panel: http://localhost:3000/admin/articles
2. Create or edit an article
3. Upload an image
4. Should work! ✅

## Alternative: Manual File Upload (Workaround)

If you don't want to upgrade to Blaze plan or CORS is giving you trouble:

### Option A: Use /public/ Directory (Easiest - No Firebase Storage Needed!)

1. Put your article images in: `/public/images/articles/`
2. In the admin panel, use this URL format: `/images/articles/your-image.jpg`
3. No Firebase Storage required!
4. Images are hosted directly with your site

### Option B: Manual Firebase Storage Upload (Requires Blaze Plan)

1. Go to Firebase Console → Storage → Files
2. Click **Upload file**
3. Upload your image to `images/articles/` folder
4. Click on the uploaded image
5. Copy the **Download URL**
6. Paste that URL directly into the article's Image URL field

### Option C: Use External Image Hosting (Free)

Use free image hosting services like:
- [Imgur](https://imgur.com/) - Free image hosting
- [Cloudinary](https://cloudinary.com/) - Free tier: 25 GB storage
- Any public image URL works!

Just paste the full URL (starting with `https://`) into the Image URL field.

## Cost: FREE (but requires credit card) 💳

**Important**: Firebase Storage requires **Blaze (Pay-as-you-go) plan**

**Free Tier Limits** (no charges within these):
- ✅ 5 GB storage
- ✅ 1 GB/day downloads
- ✅ 20,000 uploads/day
- ✅ 50,000 downloads/day

**Reality for Your Portfolio**:
- You'll use ~100 MB storage (way under 5 GB limit)
- Maybe 50 MB/day downloads (way under 1 GB limit)
- **Expected Monthly Cost: $0.00** 💚

**Safety Tips**:
1. Set a budget alert at $5/month in billing settings
2. You'll get email if you approach the limit (you won't)
3. Even if you somehow exceeded free tier, it would cost pennies

**Don't Want to Add Credit Card?**
Use the **Manual Upload Workaround** below - no billing upgrade needed!
