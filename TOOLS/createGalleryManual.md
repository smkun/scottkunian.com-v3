# Create Asia Trip Gallery in Firestore

## Problem
The Asia Trip gallery shows "Gallery not found" because the gallery document doesn't exist in Firestore yet.

## Quick Fix - Manual Creation

### Option 1: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/project/scottkunian-website/firestore)
2. Navigate to Firestore Database
3. Click "Start collection"
4. Collection ID: `galleries`
5. Click "Next"
6. Add document with these fields:

```
Document ID: (auto-generate)

Fields:
- name (string): "Asia Trip"
- slug (string): "asia-trip"
- folderPath (string): "AsiaTrip"
- description (string): "2025 journey through China and Japan - 38 locations, 535 photos capturing the essence of East Asian culture, architecture, and daily life."
- coverImage (string): "/images/gallery/AsiaTrip/202503_AirChina/FUNT0733.webp"
- imageCount (number): 535
- isVisible (boolean): true
- sortOrder (number): 0
- createdAt (timestamp): (click "Add field" → "timestamp" → "Set to current time")
- updatedAt (timestamp): (click "Add field" → "timestamp" → "Set to current time")
```

7. Click "Save"

### Option 2: Admin Panel (Recommended for future galleries)

1. Navigate to http://localhost:3000/admin/gallery
2. Click "Create New Gallery"
3. Fill in the form:
   - Name: Asia Trip
   - Slug: asia-trip
   - Folder Path: AsiaTrip
   - Description: (same as above)
   - Cover Image: /images/gallery/AsiaTrip/202503_AirChina/FUNT0733.webp
   - Check "Visible"
4. Click "Save"

## Verification

After creating the gallery, visit:
- http://localhost:3000/gallery/asia-trip

You should see the location grid with 38 locations.
