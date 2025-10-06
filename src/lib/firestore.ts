import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const COLLECTIONS = {
  POSTS: 'posts',
  NOTES: 'notes',
  PROJECTS: 'projects',
  ARTICLES: 'articles',
  GALLERIES: 'galleries',
} as const;

// Enhanced Type definitions with comprehensive schema
export interface Post {
  id?: string;
  title: string;           // SEO-optimized title
  slug: string;            // URL-friendly identifier (auto-generated from title)
  summary: string;         // Brief description for listings
  body: string;            // Markdown content
  tags: string[];          // Category/topic tags
  published: boolean;      // Draft vs published state
  featured: boolean;       // Homepage highlighting
  imageUrl?: string;       // Optional header image
  seoTitle?: string;       // Custom SEO title (fallback to title)
  seoDescription?: string; // Meta description (fallback to summary)
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last modification
  publishedAt?: Timestamp; // Publication date (for ordering)
  authorId: string;        // Reference to user (future multi-author support)
  viewCount?: number;      // Analytics tracking
}

export interface Note {
  id?: string;
  content: string;         // Markdown or plain text
  tags: string[];          // Topic categorization
  type: 'quick' | 'detailed'; // Note complexity
  mood?: 'positive' | 'neutral' | 'critical'; // Tone indicator
  linkedProjectId?: string; // Optional project reference
  isPublic: boolean;       // Visibility control
  createdAt: Timestamp;
  updatedAt?: Timestamp;   // Optional modification tracking
}

export interface Project {
  id?: string;
  name: string;            // Project display name
  description: string;     // Detailed description
  summary: string;         // Brief overview for cards
  technologies: string[];  // Tech stack array
  githubUrl?: string;      // Repository link
  liveUrl?: string;        // Live demo link
  imageUrl?: string;       // Project screenshot
  isVisible: boolean;      // Public visibility toggle
  isPinned: boolean;       // Featured project status
  source: 'manual' | 'github'; // Data source tracking
  githubData?: {           // GitHub integration metadata
    stars: number;
    language: string;
    lastPush: Timestamp;
    description: string;
  };
  lastSyncAt?: Timestamp;  // Last GitHub sync timestamp
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp; // Project completion date
}

export interface Article {
  id?: string;
  title: string;           // LinkedIn article title
  url: string;             // LinkedIn article URL
  description?: string;    // Article summary/excerpt
  imageUrl?: string;       // Featured image from LinkedIn
  publishedAt: Timestamp;  // LinkedIn publication date
  isVisible: boolean;      // Admin visibility control
  source: 'linkedin' | 'manual'; // Data source
  linkedinData?: {         // LinkedIn-specific metadata
    engagementCount?: number;
    commentsCount?: number;
    reactionsCount?: number;
  };
  createdAt: Timestamp;    // Import timestamp
  lastSyncAt?: Timestamp;  // Last sync check
}

export interface GalleryCategory {
  id?: string;
  name: string;            // Display name (e.g., "Asia Trip", "Pets", "Miniatures")
  slug: string;            // URL-friendly identifier
  folderPath: string;      // Path to images folder (e.g., "AsiaTrip", "Pets")
  description?: string;    // Optional category description
  coverImage?: string;     // Featured image for category thumbnail
  imageCount?: number;     // Cached count of images in folder
  isVisible: boolean;      // Admin visibility control
  sortOrder: number;       // Display order on gallery page
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper function to remove undefined values from objects
const removeUndefinedFields = (obj: any): any => {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

// Generic CRUD operations
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string | null> => {
  try {
    const cleanedData = removeUndefinedFields({
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    const docRef = await addDoc(collection(db, collectionName), cleanedData);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create document in ${collectionName}: ${error.message}`);
    }
    throw error;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    const cleanedData = removeUndefinedFields({
      ...data,
      updatedAt: Timestamp.now(),
    });
    await updateDoc(docRef, cleanedData);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update document ${id} in ${collectionName}: ${error.message}`);
    }
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete document ${id} from ${collectionName}: ${error.message}`);
    }
    throw error;
  }
};

export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as unknown as T;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get document ${id} from ${collectionName}: ${error.message}`);
    }
    throw error;
  }
};

export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as unknown as T));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get documents from ${collectionName}: ${error.message}`);
    }
    throw error;
  }
};

// Enhanced collection helpers with optimized queries
export const getPosts = (publishedOnly = false, featuredOnly = false) => {
  const constraints: QueryConstraint[] = [];

  if (publishedOnly) {
    constraints.push(where('published', '==', true));
  }
  if (featuredOnly) {
    constraints.push(where('featured', '==', true));
  }

  // Order by publishedAt for published posts, createdAt for drafts
  if (publishedOnly) {
    constraints.push(orderBy('publishedAt', 'desc'));
  } else {
    constraints.push(orderBy('createdAt', 'desc'));
  }

  return getDocuments<Post>(COLLECTIONS.POSTS, constraints);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const constraints: QueryConstraint[] = [
    where('slug', '==', slug),
    where('published', '==', true)
  ];
  const results = await getDocuments<Post>(COLLECTIONS.POSTS, constraints);
  return results.length > 0 ? results[0] : null;
};

export const getNotes = (publicOnly = false) => {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (publicOnly) {
    constraints.unshift(where('isPublic', '==', true));
  }
  return getDocuments<Note>(COLLECTIONS.NOTES, constraints);
};

export const getNotesByType = (type: 'quick' | 'detailed', publicOnly = false) => {
  const constraints: QueryConstraint[] = [
    where('type', '==', type),
    orderBy('createdAt', 'desc')
  ];
  if (publicOnly) {
    constraints.unshift(where('isPublic', '==', true));
  }
  return getDocuments<Note>(COLLECTIONS.NOTES, constraints);
};

export const getProjects = (visibleOnly = false) => {
  const constraints: QueryConstraint[] = [
    orderBy('isPinned', 'desc'),
    orderBy('createdAt', 'desc')
  ];
  if (visibleOnly) {
    constraints.unshift(where('isVisible', '==', true));
  }
  return getDocuments<Project>(COLLECTIONS.PROJECTS, constraints);
};

export const getProjectById = (id: string) => {
  return getDocument<Project>(COLLECTIONS.PROJECTS, id);
};

export const getProjectsByTechnology = (technology: string, visibleOnly = false) => {
  const constraints: QueryConstraint[] = [
    where('technologies', 'array-contains', technology),
    orderBy('isPinned', 'desc'),
    orderBy('createdAt', 'desc')
  ];
  if (visibleOnly) {
    constraints.unshift(where('isVisible', '==', true));
  }
  return getDocuments<Project>(COLLECTIONS.PROJECTS, constraints);
};

export const getArticles = async (visibleOnly = false): Promise<Article[]> => {
  try {
    // Try the indexed query first (preferred once index is built)
    const constraints: QueryConstraint[] = [orderBy('publishedAt', 'desc')];
    if (visibleOnly) {
      constraints.unshift(where('isVisible', '==', true));
    }
    return await getDocuments<Article>(COLLECTIONS.ARTICLES, constraints);
  } catch (error) {
    // Fallback: If index isn't ready, fetch all and filter in memory
    console.warn('Index not ready, using client-side filtering:', error);
    const allArticles = await getDocuments<Article>(COLLECTIONS.ARTICLES, [orderBy('publishedAt', 'desc')]);
    if (visibleOnly) {
      return allArticles.filter(article => article.isVisible === true);
    }
    return allArticles;
  }
};

export const getArticleById = (id: string) => {
  return getDocument<Article>(COLLECTIONS.ARTICLES, id);
};

// Utility functions for content management
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .trim();
};

export const incrementViewCount = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, COLLECTIONS.POSTS, postId);
    await updateDoc(postRef, {
      viewCount: (await getDoc(postRef)).data()?.viewCount + 1 || 1
    });
  } catch (error) {
    // Silent fail for view count increment - non-critical analytics
  }
};

// Gallery Category operations
export const getGalleryCategories = async (visibleOnly = false): Promise<GalleryCategory[]> => {
  const constraints: QueryConstraint[] = [orderBy('sortOrder', 'asc')];
  if (visibleOnly) {
    constraints.unshift(where('isVisible', '==', true));
  }
  return getDocuments<GalleryCategory>(COLLECTIONS.GALLERIES, constraints);
};

export const getGalleryCategoryById = (id: string) => {
  return getDocument<GalleryCategory>(COLLECTIONS.GALLERIES, id);
};

export const getGalleryCategoryBySlug = async (slug: string): Promise<GalleryCategory | null> => {
  try {
    const categories = await getDocuments<GalleryCategory>(COLLECTIONS.GALLERIES, [where('slug', '==', slug)]);
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error('Error fetching gallery category by slug:', error);
    return null;
  }
};