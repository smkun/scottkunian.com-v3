/**
 * Skip Navigation Link
 *
 * Allows keyboard users to skip directly to main content,
 * bypassing navigation and header elements.
 *
 * WCAG 2.4.1 (Level A): Bypass Blocks
 */
export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}
