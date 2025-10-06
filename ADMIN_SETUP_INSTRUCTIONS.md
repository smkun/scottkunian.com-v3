# Admin Setup Instructions - Quick Guide

**Project**: scottkunian-website
**Target Email**: scottkunian@gmail.com
**Estimated Time**: 5 minutes

## 🎯 What You Need to Do

You need to download a Firebase service account key to grant yourself admin access to the admin panel.

## 📋 Step-by-Step Instructions

### Step 1: Download Service Account Key

1. **Open Firebase Console**:
   - Visit: https://console.firebase.google.com/project/scottkunian-website/settings/serviceaccounts/adminsdk

2. **Generate New Private Key**:
   - Click the "Generate New Private Key" button
   - Confirm the download in the popup dialog
   - A JSON file will download (named something like `scottkunian-website-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`)

3. **Rename and Place the File**:
   - Rename the downloaded file to exactly: `firebase-service-account.json`
   - Move it to your project root directory: `/home/skunian/code/MyCode/ScottKunian.com-v4/`

### Step 2: Run the Setup Script

Once the file is in place, run:

```bash
node scripts/setAdminClaim.js
```

**Expected Output**:
```
Found user: scottkunian@gmail.com (UID: xxxxxxxxx)
✅ Admin claim successfully set for scottkunian@gmail.com
Custom claims: { admin: true }

⚠️  IMPORTANT: User must sign out and sign in again for the claim to take effect.
```

### Step 3: Refresh Your Token

1. Open the app: http://localhost:3003
2. Sign out from your current session
3. Sign in again with Google (scottkunian@gmail.com)
4. Navigate to `/admin` - you should now have access!

## ✅ Verification

After signing in, you should:
- ✅ Be able to access `/admin` routes
- ✅ See the admin dashboard
- ✅ Not see "Access Denied" messages
- ✅ Be able to create posts, projects, notes, and articles

## 🔒 Security Notes

- The `firebase-service-account.json` file is already in `.gitignore`
- **Never commit this file to git** - it contains sensitive credentials
- **Keep this file secure** - it has full admin access to your Firebase project
- The file is only needed once to set the admin claim

## ❓ Troubleshooting

### Error: "Cannot find module '../firebase-service-account.json'"
→ The file is not in the correct location. Make sure it's in the project root.

### Error: "ENOENT: no such file or directory"
→ Check the file name is exactly: `firebase-service-account.json`

### Still getting "Access Denied"
→ Make sure you signed out and signed in again after running the script

### Script runs but claim not working
→ Wait 5 minutes and try signing out/in again (token refresh delay)

## 🚀 What Happens Next

Once admin access is working:
1. ✅ Test creating a blog post
2. ✅ Test creating a project (manual or GitHub sync)
3. ✅ Test creating field notes
4. ✅ Test image uploads
5. ✅ Ready for content migration and production deployment!

---

**Need Help?** See `docs/ADMIN_SETUP.md` for detailed troubleshooting.
