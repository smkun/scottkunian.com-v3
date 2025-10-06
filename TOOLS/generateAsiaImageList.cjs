#!/usr/bin/env node

/**
 * Generate Asia Trip Image List
 *
 * Scans the AsiaTrip folder structure and generates a JSON file
 * with all images organized by location for the gallery viewer.
 */

const fs = require('fs');
const path = require('path');

const GALLERY_PATH = path.join(__dirname, '../public/images/gallery/AsiaTrip');
const OUTPUT_PATH = path.join(__dirname, '../public/images/gallery/AsiaTrip/locations.json');

function scanLocations() {
  const locations = [];

  if (!fs.existsSync(GALLERY_PATH)) {
    console.error('❌ AsiaTrip folder not found:', GALLERY_PATH);
    return locations;
  }

  const items = fs.readdirSync(GALLERY_PATH);

  items.forEach(item => {
    const fullPath = path.join(GALLERY_PATH, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Get all images in this location folder
      const images = fs.readdirSync(fullPath)
        .filter(file => file.endsWith('.webp'))
        .map(file => `/images/gallery/AsiaTrip/${item}/${file}`);

      if (images.length > 0) {
        // Parse location name (format: 202503_Location-Name_City_Country)
        const parts = item.split('_');
        const dateCode = parts[0]; // 202503
        const locationParts = parts.slice(1);

        locations.push({
          folder: item,
          displayName: locationParts.join(' ').replace(/-/g, ' '),
          dateCode: dateCode,
          images: images,
          imageCount: images.length,
          coverImage: images[0]
        });
      }
    }
  });

  // Sort by date code (newest first)
  locations.sort((a, b) => b.dateCode.localeCompare(a.dateCode));

  return locations;
}

function main() {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   Asia Trip Image List Generator      ║');
  console.log('╚═══════════════════════════════════════╝\n');

  const locations = scanLocations();

  console.log(`📍 Found ${locations.length} locations`);
  console.log(`📸 Total images: ${locations.reduce((sum, loc) => sum + loc.imageCount, 0)}\n`);

  // Sample output
  console.log('Sample locations:');
  locations.slice(0, 5).forEach(loc => {
    console.log(`   ${loc.displayName} (${loc.imageCount} photos)`);
  });
  console.log('');

  // Write to JSON file
  const output = {
    generatedAt: new Date().toISOString(),
    totalLocations: locations.length,
    totalImages: locations.reduce((sum, loc) => sum + loc.imageCount, 0),
    locations: locations
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  console.log('✅ Generated locations.json');
  console.log(`   Path: ${OUTPUT_PATH}\n`);
}

main();
