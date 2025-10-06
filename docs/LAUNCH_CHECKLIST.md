# Production Launch Checklist

## Pre-Launch (Complete Before Deploy)

- [ ] **Download Firebase service account key** → Set admin claim
- [ ] **Run QA testing checklist** (4-6 hours)
- [ ] **Production build successful** (`npm run build`)
- [ ] **Backup current website** (if replacing existing site)
- [ ] **DNS ready for update** (if custom domain)

## Launch Day

- [ ] **Deploy to Firebase Hosting**: `firebase deploy --only hosting`
- [ ] **Verify deployment**: Visit production URL
- [ ] **Test authentication**: Google sign-in works
- [ ] **Test content**: All pages load
- [ ] **Check analytics**: GA4 tracking active
- [ ] **Monitor errors**: Check Firebase Console
- [ ] **Update DNS** (if custom domain configured)

## Post-Launch (First 48 Hours)

- [ ] **Monitor performance**: Lighthouse score >90
- [ ] **Check analytics**: Traffic flowing correctly
- [ ] **Test on mobile**: iOS/Android work
- [ ] **Monitor Firebase quota**: Within limits
- [ ] **Fix any issues**: Hot-fix if needed

## Optional (Post-Launch Enhancements)

- [ ] **Migrate Field Notes content**
- [ ] **Add screenshots to README**
- [ ] **Configure LinkedIn article automation**
- [ ] **Evaluate hosting costs** after 30 days

**Estimated Time to Launch**: 4 hours after admin setup
**Created**: 2025-10-05
