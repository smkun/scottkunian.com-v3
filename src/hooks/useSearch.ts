import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export interface SearchableItem {
  id: string;
  title: string;
  content?: string;
  tags?: string[];
  type: 'post' | 'note' | 'project' | 'article';
  url: string;
}

interface UseSearchOptions {
  /**
   * Search threshold (0.0 = perfect match, 1.0 = match anything)
   * Default: 0.3 (balanced fuzzy matching)
   */
  threshold?: number;
  /**
   * Include matches in results for highlighting
   * Default: true
   */
  includeMatches?: boolean;
  /**
   * Minimum character length before search activates
   * Default: 2
   */
  minSearchLength?: number;
}

/**
 * Custom hook for client-side fuzzy search using Fuse.js
 *
 * @param items - Array of searchable items
 * @param options - Search configuration options
 * @returns Search state and functions
 *
 * @example
 * const { query, setQuery, results, isSearching } = useSearch(posts, {
 *   threshold: 0.3,
 *   minSearchLength: 2
 * });
 */
export function useSearch(
  items: SearchableItem[],
  options: UseSearchOptions = {}
) {
  const {
    threshold = 0.3,
    includeMatches = true,
    minSearchLength = 2
  } = options;

  const [query, setQuery] = useState('');

  // Initialize Fuse.js with search configuration
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: 'title', weight: 2 },      // Title is most important
        { name: 'content', weight: 1 },     // Content is secondary
        { name: 'tags', weight: 1.5 }       // Tags are important for categorization
      ],
      threshold,
      includeMatches,
      includeScore: true,
      minMatchCharLength: 2,
      distance: 100,
      location: 0,
      useExtendedSearch: false
    });
  }, [items, threshold, includeMatches]);

  // Perform search
  const results = useMemo(() => {
    if (!query || query.length < minSearchLength) {
      return [];
    }

    const fuseResults = fuse.search(query);

    return fuseResults.map(result => ({
      item: result.item,
      score: result.score || 0,
      matches: result.matches || []
    }));
  }, [query, fuse, minSearchLength]);

  const isSearching = query.length >= minSearchLength;
  const hasResults = results.length > 0;

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasResults,
    clearSearch: () => setQuery('')
  };
}
