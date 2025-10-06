# Gallery Feature Setup Guide

## Overview

The photo gallery feature is now fully integrated into your site. Here's how to use it:

## Admin Panel

### Creating Gallery Categories

1. Navigate to `/admin/gallery` in your browser
2. Click "Add New Category"
3. Fill in the form:
   - **Category Name**: Display name (e.g., "Asia Trip", "Pets", "Miniatures")
   - **Folder Path**: Folder name in `/public/images/gallery/` (e.g., "AsiaTrip", "Pets")
   - **Description** (optional): Brief description of the gallery
   - **Sort Order**: Display order (lower numbers first)
   - **Visible to public**: Toggle visibility

### Example Category

```
Name: Asia Trip
Folder Path: AsiaTrip
Description: Photos from my 2024 trip through Southeast Asia
Sort Order: 0
Visible: ✓
```

## Adding Images

### Step 1: Organize Images in Folders

Place your images in the corresponding folder under `/public/images/gallery/`:

```
public/images/gallery/
├── AsiaTrip/
│   ├── temple.jpg
│   ├── beach.jpg
│   └── street-food.jpg
├── Pets/
│   ├── fluffy.jpg
│   └── spot.jpg
└── Miniatures/
    ├── orc-warrior.jpg
    └── dragon-mini.jpg
```

### Step 2: Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.avif`

### Step 3: Update Image Counts

Run the image scanner script to automatically count images and set cover images:

```bash
node TOOLS/scanGalleryImages.cjs
```

This script will:
- Count all images in each gallery folder
- Update the `imageCount` field in Firestore
- Auto-set the first image as the cover image (if not already set)

## AsiaTrip Gallery - Getting Started

### Current Status

✅ Gallery feature fully implemented
✅ Admin management interface ready
✅ Public gallery pages created
✅ Navigation link added to header
✅ `/public/images/gallery/AsiaTrip/` folder created and ready

### Next Steps for AsiaTrip

1. **Add Your Images**:
   ```bash
   # Copy your Asia Trip photos to:
   cp /path/to/your/asia-photos/* public/images/gallery/AsiaTrip/
   ```

2. **Create the Category in Admin**:
   - Go to: http://localhost:3000/admin/gallery
   - Click "Add New Category"
   - Name: "Asia Trip"
   - Folder Path: "AsiaTrip"
   - Add description, set sort order, make visible
   - Save

3. **Scan Images**:
   ```bash
   node TOOLS/scanGalleryImages.cjs
   ```

4. **View Your Gallery**:
   - Public gallery list: http://localhost:3000/gallery
   - Asia Trip gallery: http://localhost:3000/gallery/asia-trip

## Folder Structure

```
ScottKunian.com-v4/
├── public/
│   └── images/
│       └── gallery/
│           ├── AsiaTrip/          ← Your images go here
│           ├── Pets/              ← Future gallery
│           └── Miniatures/        ← Future gallery
│
├── src/
│   ├── admin/
│   │   └── GalleryManager.tsx    ← Admin CRUD interface
│   └── pages/
│       └── Gallery/
│           └── Gallery.tsx        ← Public gallery pages
│
└── TOOLS/
    └── scanGalleryImages.cjs      ← Image counting script
```

## Features

### Admin Panel

- ✅ Create, edit, delete gallery categories
- ✅ Set category name, folder path, description
- ✅ Control visibility (show/hide from public)
- ✅ Set display order
- ✅ Search and filter categories
- ✅ View image counts

### Public Gallery

- ✅ Gallery listing page with all categories
- ✅ Individual gallery view for each category
- ✅ Image grid with responsive layout
- ✅ Lightbox modal for full-size viewing
- ✅ Category descriptions and metadata
- ✅ Image counts

### Image Management

- ✅ Automatic image counting via script
- ✅ Auto-set cover images (first image in folder)
- ✅ Support for all common image formats
- ✅ Folder-based organization

## Current Gallery Implementation

The gallery currently uses a **file system-based approach** where:

1. Images are stored in `/public/images/gallery/[folderName]/`
2. Gallery categories in Firestore point to these folders
3. The image scanner script counts files and updates metadata
4. The public gallery dynamically loads images from folders

### Future Enhancements (Optional)

If you need more advanced features, you could implement:

- **Image metadata**: Store individual image data in Firestore (captions, dates, etc.)
- **Image upload**: Admin interface to upload images directly
- **Image ordering**: Custom sort order for images within galleries
- **Image editing**: Crop, resize, filters via admin panel
- **Lazy loading**: Progressive image loading for better performance
- **Image optimization**: Automatic WebP conversion and responsive images

## Troubleshooting

### Images Not Showing

1. **Check folder path**: Ensure category `folderPath` matches actual folder name
2. **Run scanner**: Execute `node TOOLS/scanGalleryImages.cjs`
3. **Check image formats**: Only `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif` are supported
4. **Verify visibility**: Ensure category `isVisible` is set to `true`

### Image Count Not Updating

```bash
# Re-run the scanner script
node TOOLS/scanGalleryImages.cjs
```

### Cover Image Not Set

The scanner automatically sets the first image as the cover. To manually set:

1. Go to admin panel: `/admin/gallery`
2. Edit the category
3. Set `coverImage` field to: `/images/gallery/[folderPath]/[filename.jpg]`

## Example Workflow

### Creating "Asia Trip" Gallery

```bash
# 1. Add images to folder (already created)
cp ~/Pictures/asia-trip/*.jpg public/images/gallery/AsiaTrip/

# 2. Open admin panel
# Navigate to: http://localhost:3000/admin/gallery

# 3. Create category:
#    Name: Asia Trip
#    Folder Path: AsiaTrip
#    Description: Photos from my 2024 Southeast Asia adventure
#    Sort Order: 0
#    Visible: ✓

# 4. Scan images
node TOOLS/scanGalleryImages.cjs

# 5. View gallery
# Navigate to: http://localhost:3000/gallery
# Click "Asia Trip" to view all photos
```

## Navigation

The Gallery link has been added to the main site header:

```
Home | About | Field Notes | Projects | Gallery | Nybles | Get in Touch
```

Public gallery URL: http://localhost:3000/gallery

## Summary

✅ **COMPLETE**: Gallery feature fully implemented and ready to use
⏳ **PENDING**: Add your Asia Trip images to `/public/images/gallery/AsiaTrip/`
⏳ **PENDING**: Create "Asia Trip" category in admin panel
⏳ **PENDING**: Run image scanner script
⏳ **PENDING**: View your gallery!
