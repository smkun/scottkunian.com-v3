# iFastNet Deployment Guide

**Purpose**: Deploy ScottKunian.com v4 to iFastNet free hosting via automated CI/CD

## 📋 Overview

The project includes a GitHub Actions workflow that automatically deploys to iFastNet hosting whenever code is pushed to the `production` branch.

## 🚀 Quick Start

### Step 1: Setup GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to **GitHub repo → Settings → Secrets and variables → Actions**
2. Click **"New repository secret"** for each:

```
IFASTNET_FTP_SERVER=ftp.yourdomain.com
IFASTNET_FTP_USERNAME=your_username
IFASTNET_FTP_PASSWORD=your_password
```

### Step 2: Get iFastNet FTP Credentials

1. Log in to [iFastNet Control Panel](https://cpanel.ifastnet.com/)
2. Navigate to **FTP Accounts**
3. Use your main account credentials or create a new FTP account
4. Note your:
   - **FTP Server**: Usually `ftp.yourdomain.ifastnet.com` or `ftp.byethost.com`
   - **Username**: Your iFastNet username
   - **Password**: Your FTP password

### Step 3: Test Manual Deployment

Before automating, test FTP deployment manually:

```bash
# Build the project
npm run build

# Upload dist/ folder to iFastNet via FTP client (FileZilla, etc.)
# Server: ftp.yourdomain.ifastnet.com
# Port: 21
# Upload to: /htdocs/ directory
```

### Step 4: Enable Automated Deployment

```bash
# Create production branch
git checkout -b production

# Push to GitHub (triggers deployment)
git push origin production
```

## 📊 Deployment Workflow

### Automatic Deployment

**Trigger**: Push to `production` branch

```bash
# Development flow
git checkout main
# Make changes...
git add .
git commit -m "feat: new feature"
git push origin main

# When ready to deploy to iFastNet
git checkout production
git merge main
git push origin production  # 🚀 Triggers deployment
```

### Manual Deployment

**Trigger**: GitHub Actions → Run workflow

1. Go to **Actions** tab on GitHub
2. Select **"Deploy to iFastNet"** workflow
3. Click **"Run workflow"**
4. Select `production` branch
5. Click **"Run workflow"**

## 🔧 Deployment Process

The workflow performs the following steps:

1. **Checkout code** from production branch
2. **Install dependencies** (`npm ci`)
3. **Run linter** (optional, continues on error)
4. **Type check** with TypeScript
5. **Build production bundle** (`npm run build`)
6. **Generate sitemap** and **RSS feed**
7. **Prepare deployment package** (copy dist files)
8. **Upload to iFastNet** via FTP
9. **Verify deployment** and create deployment tag

## 📁 Deployment Structure

Files uploaded to iFastNet `/htdocs/` directory:

```
/htdocs/
├── index.html                    # Main HTML file
├── assets/
│   ├── index-[hash].js          # Main JavaScript bundle
│   ├── index-[hash].css         # Styles
│   ├── react-vendor-[hash].js   # React library
│   ├── firebase-vendor-[hash].js # Firebase library
│   └── [other assets]
├── sitemap.xml                   # SEO sitemap
├── rss.xml                       # Blog RSS feed
├── _redirects                    # URL redirects (if supported)
└── DEPLOYMENT_INFO.txt           # Deployment metadata
```

## ⚙️ Configuration

### Customize Upload Directory

Edit `.github/workflows/ifastnet-deploy.yml`:

```yaml
server-dir: /htdocs/         # Change to your directory
```

### Exclude Files from Deployment

```yaml
exclude: |
  **/.git*
  **/node_modules/**
  **/.env*
  **/tests/**
```

### Clean Slate Deployment (Dangerous!)

```yaml
dangerous-clean-slate: true  # Deletes all files before upload
```

⚠️ **Warning**: Only enable this if you're sure no important files exist on the server.

## 🔍 Troubleshooting

### Deployment Fails with "Connection Refused"

**Causes**:
- Incorrect FTP server address
- FTP port blocked (try passive mode)
- iFastNet server temporarily down

**Solutions**:
1. Verify FTP credentials in iFastNet control panel
2. Test connection with FTP client like FileZilla
3. Contact iFastNet support if server is down

### Deployment Succeeds but Site Not Updated

**Causes**:
- Files uploaded to wrong directory
- Browser cache showing old version
- iFastNet propagation delay

**Solutions**:
1. Check `server-dir` in workflow file (should be `/htdocs/`)
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Wait 5-10 minutes for server-side updates
4. Check DEPLOYMENT_INFO.txt on server to verify upload

### Build Fails Before Deployment

**Causes**:
- TypeScript errors
- Missing environment variables
- Dependency issues

**Solutions**:
1. Run `npm run build` locally to test
2. Fix TypeScript errors: `npx tsc --noEmit`
3. Ensure all GitHub Secrets are set (VITE_FIREBASE_* variables)
4. Check GitHub Actions logs for specific error

### FTP Upload Times Out

**Causes**:
- Large file transfer
- Network connectivity issues
- iFastNet server slow response

**Solutions**:
1. Enable passive FTP mode in workflow
2. Reduce bundle size (check build optimization)
3. Retry deployment manually

## 🎯 Best Practices

### Branch Strategy

**Recommended**:
```
main         → Development and testing (deploys to Firebase)
production   → Stable releases (deploys to iFastNet)
```

**Workflow**:
1. Develop on `main` branch
2. Test with Firebase preview deployment
3. When stable, merge to `production`
4. iFastNet deployment triggered automatically

### Pre-Deployment Checklist

✅ All tests passing
✅ TypeScript compilation successful
✅ Build size under 250 KB gzipped
✅ Firebase preview tested and working
✅ Environment variables configured in GitHub Secrets
✅ FTP credentials verified

### Rollback Strategy

If deployment breaks production:

```bash
# Find previous successful deployment tag
git tag -l "ifastnet-deploy-*"

# Checkout previous version
git checkout ifastnet-deploy-20241005-143022

# Force push to production (triggers redeployment)
git push origin HEAD:production --force
```

## 📈 Monitoring

### Deployment Status

**GitHub Actions Dashboard**:
- Go to **Actions** tab
- View workflow runs
- Check logs for errors

**Deployment Tags**:
```bash
# List all iFastNet deployments
git tag -l "ifastnet-deploy-*"

# View deployment details
git show ifastnet-deploy-20241005-143022
```

### Site Health Check

**Manual**:
- Visit https://scottkunian.com
- Check browser console for errors
- Verify Firebase connection working
- Test authentication flow

**Automated** (future enhancement):
- Setup uptime monitoring (e.g., UptimeRobot)
- Configure broken link checker
- Enable error tracking (Sentry)

## 🔐 Security

### Credential Management

**Never commit**:
- FTP passwords
- Firebase credentials
- API keys

**Always use GitHub Secrets** for sensitive data.

### File Permissions

iFastNet default permissions:
- Files: `644` (readable by all, writable by owner)
- Directories: `755` (executable/browsable by all)

### HTTPS Configuration

iFastNet may provide:
- Free SSL certificate (Let's Encrypt)
- Automatic HTTPS redirect

Check iFastNet control panel → SSL/TLS settings

## 🆘 Support

### iFastNet Support

- **Forum**: https://forum.ifastnet.com/
- **Knowledge Base**: https://ifastnet.com/support/
- **Ticket System**: Via control panel

### Project Support

- **GitHub Issues**: Report bugs and deployment issues
- **Documentation**: See PLANNING.md and TASKS.md

## 📚 Additional Resources

- **iFastNet Documentation**: https://ifastnet.com/docs/
- **FTP-Deploy-Action**: https://github.com/SamKirkland/FTP-Deploy-Action
- **GitHub Actions**: https://docs.github.com/en/actions
- **Vite Build Guide**: https://vitejs.dev/guide/build.html

---

**Status**: Workflow created, ready for iFastNet credentials configuration
**Estimated Setup Time**: 15-30 minutes
**Maintenance**: Minimal (automated deployments)
