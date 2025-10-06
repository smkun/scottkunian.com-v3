# Backup and Restore Procedures

**Project**: ScottKunian.com v4
**Date**: October 5, 2025
**Purpose**: Document backup strategies for pre-migration, production deployment, and ongoing maintenance

---

## Table of Contents

1. [Pre-Migration Backup](#pre-migration-backup)
2. [Firestore Backup](#firestore-backup)
3. [Firebase Storage Backup](#firebase-storage-backup)
4. [Code Repository Backup](#code-repository-backup)
5. [Restore Procedures](#restore-procedures)
6. [Disaster Recovery](#disaster-recovery)
7. [Backup Schedule](#backup-schedule)

---

## Pre-Migration Backup

### Current Website Backup (Before V4 Launch)

**Purpose**: Preserve existing site before deploying new React version

#### Step 1: Download Current Site Files

**If using iFastNet cPanel**:
```bash
# Option A: cPanel File Manager
1. Login to cPanel
2. Navigate to File Manager
3. Select public_html or htdocs directory
4. Click "Compress" → Create .zip archive
5. Download zip file to local machine

# Option B: FTP Download
1. Connect via FTP (FileZilla, Cyberduck, or WinSCP)
2. Navigate to website root (usually public_html/ or htdocs/)
3. Download entire directory
4. Verify file count and size match server
```

**Command line (if SSH access available)**:
```bash
# SSH into iFastNet server
ssh username@server.ifastnet.com

# Create compressed archive
tar -czf scottkunian-backup-$(date +%Y%m%d).tar.gz public_html/

# Download to local machine (run on local terminal)
scp username@server.ifastnet.com:~/scottkunian-backup-*.tar.gz ./backups/
```

#### Step 2: Organize Backup Locally

```bash
# Create backup directory structure
mkdir -p backups/pre-v4-migration
cd backups/pre-v4-migration

# Extract and organize
mkdir original-site
mv scottkunian-backup-*.tar.gz original-site/
cd original-site
tar -xzf scottkunian-backup-*.tar.gz

# Separate content by type
mkdir -p {html-pages,field-notes,images,scripts,styles,data}

# Document backup
cat > BACKUP_MANIFEST.md << EOF
# Pre-V4 Migration Backup

**Date**: $(date +%Y-%m-%d)
**Source**: iFastNet hosting
**Purpose**: Preserve original site before V4 deployment

## Contents
- Original site files: $(du -sh .)
- Backup archive: scottkunian-backup-*.tar.gz
- Extraction date: $(date)

## File Inventory
$(find . -type f | wc -l) files
$(find . -type d | wc -l) directories

## Next Steps
1. Extract Field Notes for migration
2. Identify images for Firebase Storage upload
3. Archive for long-term storage
EOF
```

#### Step 3: Extract Field Notes Specifically

```bash
# Locate Field Notes files
find . -name "*note*" -o -name "*field*" -o -name "*blog*"

# Copy Field Notes to dedicated directory
mkdir -p ../field-notes-source
cp -r [field-notes-directory]/* ../field-notes-source/

# Document Field Notes structure
cd ../field-notes-source
tree > STRUCTURE.txt
ls -la > FILE_LIST.txt
```

---

## Firestore Backup

### Automated Firestore Backup Script

**Script**: [TOOLS/backupContent.cjs](../TOOLS/backupContent.cjs)

**Features**:
- ✅ Exports all collections (posts, notes, projects, articles)
- ✅ Timestamp serialization
- ✅ JSON format for easy restore
- ✅ Manifest generation
- ✅ Dry-run support

### Manual Firestore Backup

**Option A: Using Backup Script**:
```bash
# Full backup of all collections
node TOOLS/backupContent.cjs

# Backup specific collection
node TOOLS/backupContent.cjs --collection posts

# Dry-run to see what would be backed up
node TOOLS/backupContent.cjs --dry-run
```

**Output**:
```
backups/firestore-YYYYMMDD-HHMMSS/
├── manifest.json
├── posts.json
├── notes.json
├── projects.json
└── articles.json
```

**Option B: Firebase Console Export**:
```bash
# Using Firebase CLI
firebase firestore:export gs://[your-bucket]/firestore-backups/backup-$(date +%Y%m%d)

# List backups
gsutil ls gs://[your-bucket]/firestore-backups/
```

**Option C: Google Cloud Console**:
1. Open https://console.cloud.google.com/
2. Select Firebase project
3. Navigate to Firestore → Import/Export
4. Click "Export"
5. Choose Cloud Storage bucket
6. Select collections to export
7. Click "Export"

### Restore from Firestore Backup

**Using Restore Script**:
```bash
# Restore from backup directory
node TOOLS/restoreContent.cjs backups/firestore-20251005-120000/

# Dry-run to see what would be restored
node TOOLS/restoreContent.cjs backups/firestore-20251005-120000/ --dry-run

# Restore specific collection only
node TOOLS/restoreContent.cjs backups/firestore-20251005-120000/ --collection posts
```

**Using Firebase CLI**:
```bash
# Import from Cloud Storage backup
firebase firestore:import gs://[your-bucket]/firestore-backups/backup-20251005
```

---

## Firebase Storage Backup

### Download All Storage Files

**Using gsutil** (Google Cloud SDK):
```bash
# Install gsutil (if not installed)
# https://cloud.google.com/storage/docs/gsutil_install

# Authenticate
gcloud auth login

# Download entire storage bucket
gsutil -m cp -r gs://[your-project].appspot.com ./backups/firebase-storage-$(date +%Y%m%d)/

# Download specific folder
gsutil -m cp -r gs://[your-project].appspot.com/images/ ./backups/images/
```

**Using Firebase Console**:
1. Open Firebase Console → Storage
2. Navigate to files
3. Select files or folders
4. Click "Download"
5. Repeat for all important directories

### Storage Backup Script

```javascript
// TOOLS/backupStorage.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(require('../firebase-service-account.json')),
  storageBucket: '[your-project].appspot.com'
});

const bucket = admin.storage().bucket();

async function backupStorage() {
  const backupDir = `./backups/storage-${new Date().toISOString().split('T')[0]}`;
  fs.mkdirSync(backupDir, { recursive: true });

  const [files] = await bucket.getFiles();

  for (const file of files) {
    const destination = path.join(backupDir, file.name);
    const destDir = path.dirname(destination);
    fs.mkdirSync(destDir, { recursive: true });

    await file.download({ destination });
    console.log(`Downloaded: ${file.name}`);
  }

  console.log(`Backup complete: ${files.length} files → ${backupDir}`);
}

backupStorage().catch(console.error);
```

**Run**:
```bash
node TOOLS/backupStorage.js
```

### Restore Storage Files

```bash
# Upload files back to Storage
gsutil -m cp -r ./backups/firebase-storage-20251005/* gs://[your-project].appspot.com/

# Verify upload
gsutil ls -r gs://[your-project].appspot.com/
```

---

## Code Repository Backup

### Git Repository Backup

**GitHub Repository** (already backed up automatically):
- Repository: `scottkunian/ScottKunian.com-v4` (assumed)
- All commits, branches, tags preserved
- GitHub Actions workflows included

**Local Git Bundle Backup**:
```bash
# Create complete repository bundle
git bundle create scottkunian-com-v4-$(date +%Y%m%d).bundle --all

# Move to backup location
mv scottkunian-com-v4-*.bundle ~/Backups/ External-Drive/

# Restore from bundle (if needed)
git clone scottkunian-com-v4-20251005.bundle scottkunian-com-v4-restored
```

**Tags for Important Versions**:
```bash
# Create tag before major deployment
git tag -a v4.0.0-pre-launch -m "Pre-launch backup tag"
git push origin v4.0.0-pre-launch

# Create tag after successful deployment
git tag -a v4.0.0 -m "V4 production launch"
git push origin v4.0.0
```

### Environment Variables Backup

**Critical**: `.env` file NOT in Git (correctly excluded)

**Backup `.env` securely**:
```bash
# Copy .env to secure location (NEVER commit to Git)
cp .env ~/Backups/scottkunian-env-$(date +%Y%m%d).env

# Encrypt with GPG (recommended)
gpg -c .env
mv .env.gpg ~/Backups/

# Document what environment variables exist
cat > ~/Backups/ENV_VARIABLES_LIST.txt << EOF
Required environment variables for ScottKunian.com v4:

VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_GA_MEASUREMENT_ID (optional)
VITE_SENTRY_DSN (optional)
EOF
```

---

## Restore Procedures

### Complete System Restore

**Scenario**: Catastrophic failure, need to restore entire project

#### Step 1: Restore Code

```bash
# Clone from GitHub
git clone https://github.com/scottkunian/ScottKunian.com-v4.git
cd ScottKunian.com-v4

# Or restore from bundle
git clone scottkunian-com-v4-backup.bundle ScottKunian.com-v4
cd ScottKunian.com-v4

# Install dependencies
npm install
```

#### Step 2: Restore Environment Variables

```bash
# Decrypt .env backup (if encrypted)
gpg -d ~/Backups/scottkunian-env-20251005.env.gpg > .env

# Or manually recreate .env
cp .env.example .env
# Edit .env with backed up values
```

#### Step 3: Restore Firestore Data

```bash
# Using restore script
node TOOLS/restoreContent.cjs ~/Backups/firestore-20251005-120000/

# Or using Firebase CLI
firebase firestore:import gs://backup-bucket/firestore-backup-20251005
```

#### Step 4: Restore Firebase Storage

```bash
# Upload all storage files
gsutil -m cp -r ~/Backups/firebase-storage-20251005/* gs://[project].appspot.com/
```

#### Step 5: Deploy

```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

#### Step 6: Verify

```bash
# Check website loads
curl https://scottkunian.com

# Verify Firestore data
firebase firestore:get posts --limit 1

# Verify Storage files
gsutil ls gs://[project].appspot.com/images/ | head -5
```

---

## Disaster Recovery

### Recovery Time Objectives (RTO)

| Component | Target RTO | Steps Required |
|-----------|-----------|----------------|
| **Website** | 15 minutes | Restore Firebase Hosting from previous deployment |
| **Firestore** | 1 hour | Import from Cloud Storage or local backup |
| **Storage** | 2 hours | Upload files from backup |
| **Full System** | 4 hours | Complete restore from backups |

### Recovery Point Objectives (RPO)

| Component | Target RPO | Backup Frequency |
|-----------|-----------|------------------|
| **Code** | 0 (real-time) | Git push (continuous) |
| **Firestore** | 24 hours | Daily automated backup |
| **Storage** | 7 days | Weekly backup |
| **Config** | 30 days | Manual backup before changes |

### Emergency Contacts

**Firebase Support**: https://firebase.google.com/support
**GitHub Support**: support@github.com
**Domain Registrar**: [Your registrar support]

### Rollback Procedures

**Firebase Hosting Rollback**:
```bash
# List recent deployments
firebase hosting:channel:list

# Rollback to previous deployment
firebase hosting:rollback

# Or deploy specific version
firebase deploy --only hosting --version [version-id]
```

**Firestore Rollback**:
```bash
# Restore from backup (no native rollback)
node TOOLS/restoreContent.cjs backups/firestore-[previous-date]/
```

---

## Backup Schedule

### Automated Backups

**Daily** (Recommended):
```bash
# Add to crontab or GitHub Actions
0 2 * * * cd /path/to/project && node TOOLS/backupContent.cjs
```

**GitHub Actions Workflow** (`.github/workflows/backup.yml`):
```yaml
name: Daily Firestore Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node TOOLS/backupContent.cjs
      - uses: actions/upload-artifact@v3
        with:
          name: firestore-backup
          path: backups/
          retention-days: 30
```

### Manual Backup Checklist

**Before Major Changes**:
- [ ] Create Git tag with version number
- [ ] Backup Firestore with timestamp
- [ ] Backup Firebase Storage
- [ ] Backup `.env` file securely
- [ ] Document change reason in CLAUDE.md

**Monthly**:
- [ ] Download complete Firestore export
- [ ] Download complete Storage backup
- [ ] Verify backup integrity
- [ ] Test restore procedure (dry-run)
- [ ] Archive old backups (>90 days) to external storage

**Annually**:
- [ ] Full system backup to external drive
- [ ] Update disaster recovery plan
- [ ] Test complete restoration procedure
- [ ] Review and update backup procedures

---

## Backup Storage Locations

### Recommended Structure

```
~/Backups/
├── scottkunian-com-v4/
│   ├── pre-migration/
│   │   ├── original-site/
│   │   ├── field-notes-source/
│   │   └── images-original/
│   ├── firestore/
│   │   ├── firestore-20251005-120000/
│   │   ├── firestore-20251006-020000/
│   │   └── firestore-20251007-020000/
│   ├── storage/
│   │   ├── storage-20251001/
│   │   └── storage-20251008/
│   ├── env-files/
│   │   ├── scottkunian-env-20251005.env.gpg
│   │   └── ENV_VARIABLES_LIST.txt
│   └── git-bundles/
│       ├── scottkunian-com-v4-20251001.bundle
│       └── scottkunian-com-v4-20251008.bundle
```

### Cloud Storage Recommendations

**Primary**: Google Cloud Storage (Firebase project bucket)
- Automatic with Firebase
- Integrated backup/restore
- Geographic redundancy

**Secondary**: External service (choose one)
- Backblaze B2 (cost-effective)
- AWS S3 (reliable, scalable)
- Dropbox/Google Drive (accessible)

---

## Conclusion

**Backup is Critical** for:
- Pre-migration safety (preserve current site)
- Production deployment confidence (easy rollback)
- Disaster recovery (business continuity)
- Content preservation (years of work)

**Key Principles**:
1. **3-2-1 Rule**: 3 copies, 2 different media, 1 offsite
2. **Test Restores**: Untested backups are not backups
3. **Automate**: Manual backups are forgotten backups
4. **Version**: Keep multiple backup versions (30+ days)
5. **Document**: Document backup locations and restore procedures

---

**Document Created**: 2025-10-05
**Next Review**: Before production deployment
**Owner**: Scott Kunian
