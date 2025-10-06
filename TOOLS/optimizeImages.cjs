/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format for better performance
 * Recursively processes all images in /public/images/ and subdirectories
 *
 * Usage: node scripts/optimizeImages.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMAGES_ROOT = path.join(__dirname, '../public/images');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('📦 Installing sharp for image optimization...');
  execSync('npm install --save-dev sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

/**
 * Recursively find all image files in directory and subdirectories
 */
function findImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      findImageFiles(filePath, fileList);
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      // Add image files to list
      fileList.push(filePath);
    }
  });

  return fileList;
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  console.log(`📁 Searching: ${IMAGES_ROOT}\n`);

  const imageFiles = findImageFiles(IMAGES_ROOT);

  if (imageFiles.length === 0) {
    console.log('✅ No images to optimize! All images are already in WebP format.');
    return;
  }

  console.log(`Found ${imageFiles.length} images to optimize:\n`);

  let totalSavings = 0;
  let totalOriginalSize = 0;

  for (const inputPath of imageFiles) {
    const dir = path.dirname(inputPath);
    const file = path.basename(inputPath);
    const outputFile = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(dir, outputFile);
    const relativePath = path.relative(IMAGES_ROOT, inputPath);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginalSize += originalSize;

    console.log(`  Converting: ${relativePath}`);

    try {
      await sharp(inputPath)
        .webp({ quality: 85 }) // High quality WebP
        .toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      const savings = originalSize - newSize;
      const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

      totalSavings += savings;

      console.log(`    ✅ ${file} → ${outputFile}`);
      console.log(`    📉 ${formatBytes(originalSize)} → ${formatBytes(newSize)} (saved ${savingsPercent}%)`);

      // Delete original file
      fs.unlinkSync(inputPath);
      console.log(`    🗑️  Deleted original: ${file}\n`);

    } catch (error) {
      console.error(`    ❌ Error converting ${file}:`, error.message);
    }
  }

  const totalNewSize = totalOriginalSize - totalSavings;
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Optimization complete!`);
  console.log(`📊 Total space saved: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
  console.log(`📁 Original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`📁 New size: ${formatBytes(totalNewSize)}`);
  console.log(`🚀 Images are now optimized for web delivery!`);
  console.log('='.repeat(60));
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run optimization
optimizeImages().catch(error => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});
