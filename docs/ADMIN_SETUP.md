# Admin Role Setup Guide

This guide explains how to set up Firebase custom claims for admin role security.

## Overview

The application uses Firebase custom claims to control admin access. Only users with the `admin: true` custom claim can access the admin panel and make changes to content.

## Security Architecture

1. **Frontend**: `AdminRoute` component checks for admin custom claim via `isAdmin()` function
2. **Backend**: Firestore security rules enforce `request.auth.token.admin == true` for write operations
3. **Admin Management**: Custom claims are set server-side using Firebase Admin SDK

## One-Time Setup: Grant Admin Access

### Method 1: Using Node.js Script (Recommended)

1. **Download Firebase Service Account Key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `scottkunian-website`
   - Navigate to: Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-service-account.json` in project root
   - ⚠️ **Add to .gitignore** (already configured)

2. **Install Firebase Admin SDK** (if not already installed):
   ```bash
   npm install firebase-admin
   ```

3. **Run the setup script**:
   ```bash
   node scripts/setAdminClaim.js
   ```

4. **Verify output**:
   ```
   Found user: scottkunian@gmail.com (UID: abc123...)
   ✅ Admin claim successfully set for scottkunian@gmail.com
   Custom claims: { admin: true }

   ⚠️  IMPORTANT: User must sign out and sign in again for the claim to take effect.
   ```

5. **Sign out and sign in again** in the application to refresh the token with new claims.

### Method 2: Using Firebase Console (Alternative)

1. Navigate to Firebase Console → Authentication → Users
2. Find the user `scottkunian@gmail.com`
3. Copy the UID
4. Use Firebase Admin SDK in Firebase Console or Cloud Functions:
   ```javascript
   admin.auth().setCustomUserClaims('USER_UID_HERE', { admin: true });
   ```

### Method 3: Using Cloud Functions (Production)

If you deploy the Cloud Functions (`functions/` directory), you can use:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const setAdminClaim = httpsCallable(functions, 'setAdminClaim');

// Only works if called by scottkunian@gmail.com
const result = await setAdminClaim({ email: 'scottkunian@gmail.com' });
console.log(result.data.message);
```

**Note**: Cloud Functions deployment is optional for development but recommended for production.

## Verify Admin Access

### Check in Application

1. Sign in to the application with `scottkunian@gmail.com`
2. Try to access `/admin` route
3. If you have admin access, you'll see the admin dashboard
4. If not, you'll see "Access Denied" message

### Check Programmatically

Use the browser console on the admin page:

```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  user.getIdTokenResult().then(idTokenResult => {
    console.log('Admin claim:', idTokenResult.claims.admin);
    console.log('All claims:', idTokenResult.claims);
  });
}
```

## Security Rules

The Firestore security rules enforce admin checks:

```javascript
function isAdmin() {
  return request.auth != null &&
         request.auth.token.admin == true;
}
```

All write operations to collections (`posts`, `projects`, `notes`, `articles`) require `isAdmin()` to return true.

## Troubleshooting

### "Access Denied" after setting claim

**Solution**: Sign out and sign in again. Custom claims are cached in the ID token, which needs to be refreshed.

### Claims not showing up

**Causes**:
- Service account key not downloaded
- User doesn't exist in Firebase Auth
- Script ran with errors

**Solution**: Check script output for errors and verify user exists in Firebase Console.

### Multiple users need admin access

**Current implementation**: Only `scottkunian@gmail.com` is authorized.

**To add more admins**: Modify the `AUTHORIZED_ADMIN_EMAIL` constant in:
- `functions/src/index.ts` (if using Cloud Functions)
- `scripts/setAdminClaim.js` (if using script)

## Production Deployment

For production, it's recommended to:

1. Deploy Cloud Functions for admin management:
   ```bash
   firebase deploy --only functions
   ```

2. Keep the service account key **secure** and **never commit it to git**

3. Use environment variables for sensitive configuration

4. Monitor admin access in Firebase Auth logs

5. Implement admin audit logging for security compliance

## Emergency Access Removal

To remove admin access:

```bash
node scripts/removeAdminClaim.js
```

Or manually via Firebase Admin SDK:

```javascript
admin.auth().setCustomUserClaims(userUid, { admin: false });
```

## Files Modified for Admin Security

- `src/lib/auth.ts` - Added `isAdmin()`, `getUserClaims()`, `refreshUserToken()`
- `src/components/auth/ProtectedRoute.tsx` - Real admin role enforcement in `AdminRoute`
- `firestore.rules` - Custom claims validation in `isAdmin()` function
- `functions/src/index.ts` - Admin claim management Cloud Functions
- `scripts/setAdminClaim.js` - One-time setup script

## Next Steps

After setting up admin access:

1. ✅ Verify admin can access `/admin` routes
2. ✅ Test that non-admin users see "Access Denied"
3. ✅ Deploy Firestore security rules: `firebase deploy --only firestore:rules`
4. ✅ (Optional) Deploy Cloud Functions: `firebase deploy --only functions`
5. ✅ Test content creation/editing in admin panel
