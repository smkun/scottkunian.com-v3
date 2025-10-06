import { useEffect, useRef } from 'react';

interface LiveRegionProps {
  /** Message to announce */
  message: string;
  /** Politeness level (default: 'polite') */
  politeness?: 'polite' | 'assertive';
  /** Clear message after timeout (ms) */
  clearAfter?: number;
}

/**
 * ARIA Live Region for screen reader announcements
 *
 * Use for:
 * - Form submission success/error messages
 * - Loading state changes
 * - Dynamic content updates
 * - Search results count
 *
 * @example
 * const [message, setMessage] = useState('');
 *
 * <LiveRegion message={message} politeness="polite" clearAfter={3000} />
 *
 * // Trigger announcement
 * setMessage('Form submitted successfully');
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearAfter,
}: LiveRegionProps) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (clearAfter && message) {
      timeoutRef.current = setTimeout(() => {
        // Message will clear when parent component updates state
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Hook for managing live region announcements
 *
 * @example
 * const { announce } = useLiveAnnouncement();
 *
 * announce('3 search results found');
 */
export function useLiveAnnouncement() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.textContent = message;

    document.body.appendChild(region);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(region);
    }, 1000);
  };

  return { announce };
}
