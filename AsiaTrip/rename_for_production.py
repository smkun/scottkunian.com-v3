#!/usr/bin/env python3
"""
Rename image folders to English-only names for production deployment
while preserving Asian characters in display names.
"""

import os
import json
import shutil
import re
from pathlib import Path

def extract_english_name(folder_name):
    """Extract English name from folder that contains both Asian and English text."""
    # Look for pattern like: 202503_亚运村街道_朝阳区_北京市_中国_Asian-Games-Village-Street_Chaoyang-District_Beijing_China
    # We want the part after the last occurrence of Chinese characters
    
    # Split by underscores and find the English parts
    parts = folder_name.split('_')
    english_parts = []
    
    # Look for parts that contain only ASCII characters (English)
    for part in parts:
        # Check if part contains only ASCII characters and common symbols
        if all(ord(char) < 128 for char in part):
            english_parts.append(part)
    
    # If we found English parts, join them
    if len(english_parts) >= 2:  # At least date + one location part
        return '_'.join(english_parts)
    
    # Fallback: create a simple English name
    # Extract the date part (202503)
    date_match = re.match(r'^(\d{6})', folder_name)
    date_part = date_match.group(1) if date_match else '202503'
    
    # Create a simple hash-based name for uniqueness
    import hashlib
    hash_suffix = hashlib.md5(folder_name.encode()).hexdigest()[:8]
    return f"{date_part}_location_{hash_suffix}"

def rename_folders_for_production():
    """Rename all image folders to English-only names."""
    
    # Load current photo data
    with open('photo_data.json', 'r', encoding='utf-8') as f:
        photo_data = json.load(f)
    
    images_dir = Path('images')
    new_photo_data = {}
    folder_mapping = {}
    
    print("🔄 Renaming folders for production compatibility...")
    
    for original_folder in images_dir.iterdir():
        if not original_folder.is_dir():
            continue
            
        original_name = original_folder.name
        
        # Extract or create English-only name
        english_name = extract_english_name(original_name)
        
        # Ensure uniqueness
        counter = 1
        base_english_name = english_name
        while english_name in folder_mapping.values():
            english_name = f"{base_english_name}_{counter}"
            counter += 1
        
        new_folder_path = images_dir / english_name
        
        print(f"📁 {original_name}")
        print(f"   → {english_name}")
        
        # Rename the actual folder
        if original_folder.name != english_name:
            original_folder.rename(new_folder_path)
        
        # Store mapping
        folder_mapping[original_name] = english_name
        
        # Update photo data with new structure
        if original_name in photo_data:
            location_data = photo_data[original_name].copy()
            
            # Update paths in image data
            for image in location_data['images']:
                old_path = image['path']
                new_path = old_path.replace(f'images/{original_name}/', f'images/{english_name}/')
                image['path'] = new_path
            
            # Keep original name as display name, use English name as key
            location_data['original_name'] = original_name
            location_data['english_folder'] = english_name
            location_data['display_name'] = original_name  # Keep Asian characters for display
            
            new_photo_data[english_name] = location_data
    
    # Save updated photo data
    with open('photo_data.json', 'w', encoding='utf-8') as f:
        json.dump(new_photo_data, f, ensure_ascii=False, indent=2)
    
    # Create backup of original data
    with open('photo_data_original_names.json', 'w', encoding='utf-8') as f:
        json.dump(photo_data, f, ensure_ascii=False, indent=2)
    
    # Save folder mapping for reference
    with open('folder_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(folder_mapping, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Successfully renamed {len(folder_mapping)} folders!")
    print("📄 Updated photo_data.json with new structure")
    print("📄 Created photo_data_original_names.json as backup")
    print("📄 Created folder_mapping.json for reference")
    
    return folder_mapping

if __name__ == "__main__":
    try:
        mapping = rename_folders_for_production()
        print("\n🎉 Folders renamed for production! Your site is now ready to deploy.")
        print("✨ Asian characters are preserved in display names on the website.")
    except Exception as e:
        print(f"❌ Error: {e}")