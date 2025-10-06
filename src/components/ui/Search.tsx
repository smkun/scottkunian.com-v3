import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from './Input';
import { Badge } from './Badge';
import type { SearchableItem } from '../../hooks/useSearch';

interface SearchProps {
  /** Search query value */
  query: string;
  /** Callback when query changes */
  onQueryChange: (query: string) => void;
  /** Search results from useSearch hook */
  results: Array<{
    item: SearchableItem;
    score: number;
  }>;
  /** Whether search is active */
  isSearching: boolean;
  /** Whether there are results */
  hasResults: boolean;
  /** Placeholder text for search input */
  placeholder?: string;
  /** Show results dropdown */
  showResults?: boolean;
  /** Max results to display */
  maxResults?: number;
}

/**
 * Search Component with live results dropdown
 *
 * Features:
 * - Real-time fuzzy search
 * - Keyboard navigation (arrow keys, Enter, Escape)
 * - Click-outside to close
 * - Result highlighting
 * - Type badges for different content types
 *
 * @example
 * <Search
 *   query={query}
 *   onQueryChange={setQuery}
 *   results={searchResults}
 *   isSearching={isSearching}
 *   hasResults={hasResults}
 * />
 */
export function Search({
  query,
  onQueryChange,
  results,
  isSearching,
  hasResults,
  placeholder = 'Search posts, projects, articles...',
  showResults = true,
  maxResults = 5
}: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when typing
  useEffect(() => {
    if (query.length >= 2 && hasResults) {
      setIsOpen(true);
      setSelectedIndex(0);
    }
  }, [query, hasResults]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < Math.min(results.length, maxResults) - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;

      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          window.location.href = results[selectedIndex].item.url;
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        onQueryChange('');
        break;
    }
  };

  const getTypeBadgeVariant = (type: SearchableItem['type']): 'primary' | 'secondary' | 'accent' | 'warning' | 'error' => {
    switch (type) {
      case 'post':
        return 'primary';
      case 'project':
        return 'accent';
      case 'article':
        return 'secondary';
      case 'note':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const displayResults = results.slice(0, maxResults);

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && hasResults && setIsOpen(true)}
          className="w-full pl-10 pr-4"
          aria-label="Search content"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />

        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Loading Indicator */}
        {isSearching && query.length >= 2 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && isOpen && isSearching && (
        <div
          id="search-results"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {hasResults ? (
            <ul className="py-2">
              {displayResults.map((result, index) => (
                <li key={result.item.id} role="option" aria-selected={index === selectedIndex}>
                  <Link
                    to={result.item.url}
                    className={`block px-4 py-3 hover:bg-muted transition-colors ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      onQueryChange('');
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {result.item.title}
                        </h3>
                        {result.item.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {result.item.content}
                          </p>
                        )}
                      </div>
                      <Badge variant={getTypeBadgeVariant(result.item.type)} className="shrink-0">
                        {result.item.type}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <svg
                className="mx-auto h-12 w-12 mb-2 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          <div className="border-t border-border px-4 py-2 bg-muted/50 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-card border border-border rounded">↑↓</kbd> navigate
            <kbd className="ml-2 px-1.5 py-0.5 bg-card border border-border rounded">↵</kbd> select
            <kbd className="ml-2 px-1.5 py-0.5 bg-card border border-border rounded">esc</kbd> close
          </div>
        </div>
      )}
    </div>
  );
}
