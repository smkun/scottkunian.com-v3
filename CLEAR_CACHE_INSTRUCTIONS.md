# Clear Firestore Cache to Fix Gallery Permissions

## The Problem
The browser has cached old Firestore security rules that are blocking gallery access.

## Solution: Clear IndexedDB Cache

### Method 1: Clear IndexedDB (Recommended)

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. In left sidebar, expand **Storage** → **IndexedDB**
4. Find database named `firebaseLocalStorageDb`
5. **Right-click** on `firebaseLocalStorageDb` → **Delete database**
6. Refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Method 2: Clear All Site Data

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. In left sidebar, click **Storage** (top level)
4. Click **Clear site data** button
5. Refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Method 3: Incognito Window (Quick Test)

1. Open a new Incognito/Private window
2. Navigate to http://localhost:3003/gallery/asia-trip
3. This will use fresh Firestore rules without cached data

## Verify It Works

After clearing cache, navigate to:
- http://localhost:3003/gallery/asia-trip

You should see the location grid with 38 locations (China and Japan photos).

## Why This Happened

When we deployed the updated Firestore rules at 17:38:13 UTC, your browser had already loaded the old rules and cached them in IndexedDB. The Firestore SDK doesn't automatically refresh cached rules - you need to manually clear the cache or wait ~10-15 minutes for it to expire.
