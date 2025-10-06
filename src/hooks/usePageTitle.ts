import { useEffect } from 'react';

/**
 * Custom hook to set the document title dynamically based on the current page
 *
 * @param title - Page-specific title
 * @param includeAppName - Whether to append " | Scott Kunian" (default: true)
 *
 * @example
 * usePageTitle('About Me'); // Sets title to "About Me | Scott Kunian"
 * usePageTitle('Admin Dashboard', false); // Sets title to "Admin Dashboard"
 */
export function usePageTitle(title: string, includeAppName: boolean = true) {
  useEffect(() => {
    const appName = 'Scott Kunian';
    const fullTitle = includeAppName ? `${title} | ${appName}` : title;

    document.title = fullTitle;

    // Cleanup: restore default title when component unmounts
    return () => {
      document.title = 'Scott Kunian - IT Professional';
    };
  }, [title, includeAppName]);
}
