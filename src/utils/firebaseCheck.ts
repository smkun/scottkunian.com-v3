import { auth, db, storage } from '../lib/firebase';

export const checkFirebaseConnection = async (): Promise<{
  auth: boolean;
  firestore: boolean;
  storage: boolean;
  errors: string[];
}> => {
  const result = {
    auth: false,
    firestore: false,
    storage: false,
    errors: [] as string[],
  };

  // Check Auth
  try {
    if (auth) {
      result.auth = true;
    }
  } catch (error) {
    result.errors.push(`Auth error: ${error}`);
  }

  // Check Firestore
  try {
    if (db) {
      result.firestore = true;
    }
  } catch (error) {
    result.errors.push(`Firestore error: ${error}`);
  }

  // Check Storage
  try {
    if (storage) {
      result.storage = true;
    }
  } catch (error) {
    result.errors.push(`Storage error: ${error}`);
  }

  return result;
};

export const logFirebaseStatus = async () => {
  const status = await checkFirebaseConnection();
  console.log('Firebase Connection Status:', status);
  return status;
};