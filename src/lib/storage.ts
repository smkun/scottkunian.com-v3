// Firebase Storage wrapper
// TEMPORARY: Firebase Storage TypeScript imports failing with v10.4.0
// Module resolution issue - needs investigation or Firebase upgrade
// TODO: Fix Firebase Storage TypeScript module resolution

// @ts-ignore - Temporary workaround for Firebase Storage module resolution
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import app from './firebase';

export const uploadFile = async (
  file: File,
  path: string
): Promise<string | null> => {
  try {
    const storage = getStorage(app);
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload file to ${path}: ${error.message}`);
    }
    throw error;
  }
};

export const uploadImage = async (
  file: File,
  folder: 'posts' | 'projects' | 'notes' | 'articles' | 'general' = 'general'
): Promise<string | null> => {
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name}`;
  const path = `images/${folder}/${filename}`;

  return uploadFile(file, path);
};

export const deleteFile = async (url: string): Promise<boolean> => {
  try {
    const storage = getStorage(app);
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete file ${url}: ${error.message}`);
    }
    throw error;
  }
};

export const listFiles = async (folder: string): Promise<string[]> => {
  try {
    const storage = getStorage(app);
    const folderRef = ref(storage, folder);
    const result = await listAll(folderRef);

    const urls = await Promise.all(
      result.items.map((itemRef: any) => getDownloadURL(itemRef))
    );

    return urls;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to list files in ${folder}: ${error.message}`);
    }
    throw error;
  }
};