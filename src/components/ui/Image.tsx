import { useState } from 'react';
import { cn } from '../../lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image source URL */
  src: string;
  /** Alternative text (required for accessibility) */
  alt: string;
  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Object fit behavior */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Lazy load the image */
  lazy?: boolean;
}

/**
 * Optimized Image Component
 *
 * Features:
 * - Native lazy loading
 * - Loading skeleton
 * - Aspect ratio preservation
 * - Error handling
 * - Accessibility
 *
 * @example
 * <Image
 *   src="/path/to/image.jpg"
 *   alt="Project screenshot"
 *   aspectRatio="16/9"
 *   objectFit="cover"
 *   lazy
 * />
 */
export function Image({
  src,
  alt,
  aspectRatio,
  objectFit = 'cover',
  showSkeleton = true,
  lazy = true,
  className,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <div
      className={cn('relative overflow-hidden bg-muted', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading Skeleton */}
      {showSkeleton && isLoading && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Error State */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
          <svg
            className="w-12 h-12 mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Image failed to load</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full',
            objectFitClasses[objectFit],
            isLoading && 'opacity-0',
            !isLoading && 'opacity-100 transition-opacity duration-300'
          )}
          {...props}
        />
      )}
    </div>
  );
}
