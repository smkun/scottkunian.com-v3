import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    // Error handling - throw to caller for proper UI feedback
    throw error;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    // Log critical auth errors only
    if (error instanceof Error) {
      console.error('Authentication error:', error.message);
    }
    return false;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user has admin privileges via Firebase custom claims
 *
 * This function verifies admin status by checking the custom claims
 * in the user's ID token. Custom claims are set server-side via
 * Firebase Functions (setAdminClaim function).
 *
 * @param user - Firebase User object
 * @param forceRefresh - Force token refresh to get latest claims (default: false)
 * @returns Promise<boolean> - True if user has admin claim, false otherwise
 */
export const isAdmin = async (
  user: User | null,
  forceRefresh: boolean = false
): Promise<boolean> => {
  if (!user) {
    return false;
  }

  try {
    // Get ID token result with custom claims
    const idTokenResult = await user.getIdTokenResult(forceRefresh);

    // Check for admin custom claim
    const adminClaim = idTokenResult.claims.admin;

    // Verify claim is explicitly true (not just truthy)
    return adminClaim === true;
  } catch (error) {
    // Log error but return false for security
    if (error instanceof Error) {
      console.error('Error verifying admin status:', error.message);
    }
    return false;
  }
};

/**
 * Get current user's custom claims
 *
 * Useful for debugging and verification of custom claims
 *
 * @param user - Firebase User object
 * @returns Promise<Record<string, unknown>> - Custom claims object
 */
export const getUserClaims = async (
  user: User | null
): Promise<Record<string, unknown>> => {
  if (!user) {
    return {};
  }

  try {
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching user claims:', error.message);
    }
    return {};
  }
};

/**
 * Refresh user's ID token to get latest custom claims
 *
 * Call this after setting custom claims server-side to ensure
 * the client has the latest token with updated claims.
 *
 * @param user - Firebase User object
 * @returns Promise<boolean> - True if refresh successful
 */
export const refreshUserToken = async (user: User | null): Promise<boolean> => {
  if (!user) {
    return false;
  }

  try {
    // Force token refresh
    await user.getIdToken(true);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error refreshing user token:', error.message);
    }
    return false;
  }
};

export { auth };