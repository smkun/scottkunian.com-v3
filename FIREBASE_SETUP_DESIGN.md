# Firebase Setup Design - ScottKunian.com v4

## Overview & Requirements

### Project Goals
Transform ScottKunian.com from basic HTML/CSS/JS to a React-based application with Firebase backend, supporting automated content syndication and streamlined admin experience.

### Firebase Services Required
- **Authentication**: Google OAuth for admin access with custom claims
- **Firestore**: Document database for posts, notes, projects, and articles
- **Storage**: File hosting for images and assets with web upload capabilities
- **Functions**: (Future) Automated content syndication from GitHub/LinkedIn

### Success Criteria
- Firebase project configured with appropriate billing and quotas
- Admin authentication working with Google OAuth provider
- Firestore collections created with proper security rules
- Storage bucket configured for image uploads
- SDK integrated with React application
- Environment variables configured securely

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ScottKunian.com v4                       │
│                  React + TypeScript + Vite                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Firebase SDK
┌─────────────────────▼───────────────────────────────────────┐
│                   Firebase Project                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Auth     │  │  Firestore  │  │   Storage   │         │
│  │             │  │             │  │             │         │
│  │ • Google    │  │ • posts     │  │ • images/   │         │
│  │ • Custom    │  │ • notes     │  │ • assets/   │         │
│  │   Claims    │  │ • projects  │  │ • uploads/  │         │
│  │ • Admin     │  │ • articles  │  │             │         │
│  │   Roles     │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Phase 1: Firebase Console Setup (30 minutes)

### 1.1 Project Creation
```bash
# Firebase Console Steps:
1. Navigate to https://console.firebase.google.com/
2. Click "Create a project"
3. Project name: "scottkunian-com-v4"
4. Project ID: "scottkunian-com-v4" (or auto-generated)
5. Enable Google Analytics: YES
6. Analytics location: United States
7. Create project
```

### 1.2 Billing Configuration
```bash
# Upgrade to Blaze Plan (Pay-as-you-go)
1. Project Settings → Usage and billing
2. Details & settings → Modify plan
3. Select "Blaze" plan
4. Set budget alerts:
   - $10/month warning
   - $25/month limit
```

### 1.3 Service Enablement
```bash
# Enable required services:
1. Authentication → Get Started
2. Firestore Database → Create database
3. Storage → Get Started
4. Functions → Get Started (for future use)
```

## Phase 2: Authentication Configuration (45 minutes)

### 2.1 Google OAuth Provider Setup
```javascript
// Firebase Console → Authentication → Sign-in method
{
  "provider": "Google",
  "status": "enabled",
  "authorizedDomains": [
    "localhost",
    "scottkunian.com",
    "*.scottkunian.com"
  ],
  "webClientId": "auto-generated",
  "webClientSecret": "auto-generated"
}
```

### 2.2 Admin User Configuration
```javascript
// Admin email configuration
const ADMIN_EMAIL = "scott@scottkunian.com";

// Custom claims setup (via Functions or Admin SDK)
const adminClaims = {
  admin: true,
  role: "site_admin",
  permissions: ["read", "write", "delete", "publish"]
};
```

### 2.3 Authentication Rules
```javascript
// Security considerations
const authRules = {
  "adminVerification": "Email-based admin verification",
  "sessionManagement": "Firebase Auth handles tokens",
  "customClaims": "Server-side verification for admin routes",
  "logoutHandling": "Complete session cleanup on logout"
};
```

## Phase 3: Firestore Database Setup (30 minutes)

### 3.1 Collections Schema
```javascript
// Collection: posts
{
  "id": "string (auto-generated)",
  "title": "string",
  "slug": "string (unique)",
  "summary": "string",
  "body": "string (markdown)",
  "tags": "array<string>",
  "featured": "boolean",
  "published": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "author": "string (admin email)"
}

// Collection: notes
{
  "id": "string (auto-generated)",
  "content": "string",
  "tags": "array<string>",
  "published": "boolean",
  "createdAt": "timestamp",
  "author": "string (admin email)"
}

// Collection: projects
{
  "id": "string (auto-generated)",
  "title": "string",
  "description": "string",
  "technology": "array<string>",
  "githubUrl": "string",
  "liveUrl": "string",
  "imageUrl": "string",
  "featured": "boolean",
  "manual": "boolean",
  "visible": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "source": "string (manual|github)"
}

// Collection: articles
{
  "id": "string (auto-generated)",
  "title": "string",
  "url": "string",
  "summary": "string",
  "publishedAt": "timestamp",
  "source": "string (linkedin|manual)",
  "status": "string (draft|published)",
  "createdAt": "timestamp",
  "imageUrl": "string"
}
```

### 3.2 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check admin status
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.admin == true;
    }

    // Posts collection
    match /posts/{postId} {
      allow read: if resource.data.published == true;
      allow write: if isAdmin();
    }

    // Notes collection
    match /notes/{noteId} {
      allow read: if resource.data.published == true;
      allow write: if isAdmin();
    }

    // Projects collection
    match /projects/{projectId} {
      allow read: if resource.data.visible == true;
      allow write: if isAdmin();
    }

    // Articles collection
    match /articles/{articleId} {
      allow read: if resource.data.status == "published";
      allow write: if isAdmin();
    }
  }
}
```

### 3.3 Database Indexes
```javascript
// Composite indexes for common queries
const indexes = [
  {
    "collection": "posts",
    "fields": [
      {"field": "published", "order": "ASCENDING"},
      {"field": "createdAt", "order": "DESCENDING"}
    ]
  },
  {
    "collection": "projects",
    "fields": [
      {"field": "visible", "order": "ASCENDING"},
      {"field": "featured", "order": "DESCENDING"},
      {"field": "createdAt", "order": "DESCENDING"}
    ]
  }
];
```

## Phase 4: Storage Configuration (15 minutes)

### 4.1 Storage Bucket Setup
```javascript
// Default bucket: scottkunian-com-v4.appspot.com
const storageConfig = {
  "bucketName": "scottkunian-com-v4.appspot.com",
  "location": "us-central1",
  "storageClass": "STANDARD"
};
```

### 4.2 Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images folder - admin write, public read
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;
    }

    // Assets folder - admin only
    match /assets/{assetId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;
    }

    // Uploads folder - admin only
    match /uploads/{uploadId} {
      allow read: if request.auth != null &&
                     request.auth.token.admin == true;
      allow write: if request.auth != null &&
                      request.auth.token.admin == true;
    }
  }
}
```

### 4.3 CORS Configuration
```javascript
// CORS configuration for web uploads
const corsConfig = [
  {
    "origin": ["http://localhost:5173", "https://scottkunian.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
];
```

## Phase 5: SDK Integration (20 minutes)

### 5.1 Package Installation
```bash
npm install firebase
npm install --save-dev @types/firebase
```

### 5.2 Environment Variables
```env
# .env.local
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=scottkunian-com-v4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scottkunian-com-v4
VITE_FIREBASE_STORAGE_BUCKET=scottkunian-com-v4.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_ADMIN_EMAIL=scott@scottkunian.com
```

### 5.3 Firebase Configuration Module
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### 5.4 Authentication Context
```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Check for admin custom claims
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Implementation Checklist

### Pre-Setup Verification
- [ ] Google account with appropriate permissions
- [ ] Credit card for Firebase Blaze plan billing
- [ ] Domain ownership verification (scottkunian.com)
- [ ] Development environment ready (Node.js, npm/yarn)

### Firebase Console Setup
- [ ] Firebase project created with appropriate name
- [ ] Blaze plan configured with budget alerts
- [ ] Authentication service enabled
- [ ] Firestore database created (production mode)
- [ ] Storage bucket created
- [ ] Google OAuth provider configured
- [ ] Authorized domains added (localhost, scottkunian.com)

### Database Configuration
- [ ] Firestore security rules deployed
- [ ] Initial collections created (can be empty)
- [ ] Composite indexes configured
- [ ] Storage security rules deployed
- [ ] CORS configuration applied

### SDK Integration
- [ ] Firebase SDK installed in React project
- [ ] Environment variables configured
- [ ] Firebase config module created
- [ ] Authentication context implemented
- [ ] Basic connection test successful

### Security Verification
- [ ] Admin email configured correctly
- [ ] Custom claims can be set (test via Admin SDK)
- [ ] Security rules prevent unauthorized access
- [ ] Storage rules protect admin-only areas
- [ ] Environment variables secured (not in git)

## Testing & Validation

### Authentication Testing
```typescript
// Test admin authentication flow
const testAuth = async () => {
  try {
    // 1. Sign in with Google
    const result = await signInWithGoogle();

    // 2. Verify admin claims
    const token = await result.user.getIdTokenResult();
    console.log('Admin claims:', token.claims.admin);

    // 3. Test protected route access
    // Should succeed for admin, fail for non-admin
  } catch (error) {
    console.error('Auth test failed:', error);
  }
};
```

### Firestore Testing
```typescript
// Test database operations
const testFirestore = async () => {
  try {
    // 1. Test read operation (should work for published content)
    const posts = await getDocs(collection(db, 'posts'));

    // 2. Test write operation (should require admin)
    await addDoc(collection(db, 'posts'), {
      title: 'Test Post',
      published: false,
      createdAt: new Date()
    });

    console.log('Firestore test successful');
  } catch (error) {
    console.error('Firestore test failed:', error);
  }
};
```

### Storage Testing
```typescript
// Test file upload
const testStorage = async (file: File) => {
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Upload successful:', downloadUrl);
  } catch (error) {
    console.error('Storage test failed:', error);
  }
};
```

## Risk Mitigation

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|--------|----------|
| **Auth fails** | Incorrect OAuth config | Verify client ID and authorized domains |
| **Firestore permission denied** | Security rules too restrictive | Test rules with Firebase emulator |
| **Storage CORS errors** | Missing CORS configuration | Configure CORS for web domain |
| **Custom claims not working** | Admin email mismatch | Verify exact email match in config |
| **Environment variables undefined** | Missing .env file | Ensure .env.local exists and is loaded |

### Monitoring & Alerts
- Set up Firebase console usage monitoring
- Configure billing alerts for unexpected costs
- Monitor authentication failure rates
- Track Firestore read/write quotas
- Set up error reporting for production issues

## Next Steps Integration

After successful Firebase setup, the following tasks become ready:

1. **Initialize Vite + React + TypeScript project structure**
   - Firebase SDK will be available for immediate integration
   - Authentication context can be used in route protection

2. **Install Tailwind CSS and configure build pipeline**
   - No Firebase dependencies, can proceed in parallel

3. **Create basic routing structure with React Router**
   - Can implement protected admin routes using Firebase auth

4. **Implement Google Authentication with Firebase Auth**
   - Firebase Auth service ready for implementation
   - Admin claims system ready for role-based access

This Firebase foundation enables all subsequent content management, admin panel, and automation features planned for the ScottKunian.com v4 project.