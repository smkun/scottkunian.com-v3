/**
 * Google Analytics 4 Integration with Web Vitals
 *
 * Setup Instructions:
 * 1. Add GA4 measurement ID to .env file: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 2. Import and call initAnalytics() in main.tsx
 * 3. Install web-vitals: npm install web-vitals
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Initialize Google Analytics 4
 *
 * @param measurementId - GA4 Measurement ID (G-XXXXXXXXXX)
 */
export function initAnalytics(measurementId?: string) {
  const gaId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!gaId) {
    console.warn('GA4 Measurement ID not provided. Analytics disabled.');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date().toISOString());
  window.gtag('config', gaId, {
    send_page_view: true,
  });

  console.log('Google Analytics initialized:', gaId);
}

/**
 * Track custom event
 *
 * @param eventName - Event name
 * @param eventParams - Event parameters
 *
 * @example
 * trackEvent('search', { search_term: 'react hooks' });
 * trackEvent('login', { method: 'google' });
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (!window.gtag) {
    console.warn('GA not initialized. Event not tracked:', eventName);
    return;
  }

  window.gtag('event', eventName, eventParams);
}

/**
 * Track page view
 *
 * @param path - Page path
 * @param title - Page title
 */
export function trackPageView(path: string, title?: string) {
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Initialize Web Vitals tracking
 *
 * Automatically tracks Core Web Vitals:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 *
 * @example
 * // In main.tsx:
 * initAnalytics();
 * initWebVitals();
 */
export async function initWebVitals() {
  if (!window.gtag) {
    console.warn('GA not initialized. Web Vitals not tracked.');
    return;
  }

  try {
    // Dynamically import web-vitals to avoid bundling if not used
    const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

    // Helper to send metric to GA4
    function sendToAnalytics(metric: {
      name: string;
      value: number;
      id: string;
      delta: number;
      rating: 'good' | 'needs-improvement' | 'poor';
    }) {
      const { name, value, id, delta, rating } = metric;

      trackEvent(name, {
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        metric_id: id,
        metric_value: value,
        metric_delta: delta,
        metric_rating: rating,
        event_category: 'Web Vitals',
      });

      console.log(`Web Vital - ${name}:`, {
        value: Math.round(value),
        rating,
      });
    }

    // Track all Core Web Vitals (v4 API uses onXXX functions)
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // INP replaces FID in web-vitals v4
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    console.log('Web Vitals tracking initialized');
  } catch (error) {
    console.warn('web-vitals library not installed. Run: npm install web-vitals');
  }
}

/**
 * Track custom timing
 *
 * @param name - Timing name
 * @param value - Duration in milliseconds
 * @param category - Category (default: 'Performance')
 */
export function trackTiming(
  name: string,
  value: number,
  category: string = 'Performance'
) {
  trackEvent('timing_complete', {
    name,
    value: Math.round(value),
    event_category: category,
  });
}

/**
 * Track search query
 *
 * @param searchTerm - Search query
 */
export function trackSearch(searchTerm: string) {
  trackEvent('search', {
    search_term: searchTerm,
  });
}

/**
 * Track content interaction
 *
 * @param contentType - Type of content (post, project, article, note)
 * @param contentId - Content ID
 * @param action - Action (view, click, share)
 */
export function trackContentInteraction(
  contentType: 'post' | 'project' | 'article' | 'note',
  contentId: string,
  action: 'view' | 'click' | 'share'
) {
  trackEvent(`${contentType}_${action}`, {
    content_type: contentType,
    content_id: contentId,
  });
}

/**
 * Track error
 *
 * @param error - Error object or message
 * @param fatal - Whether error is fatal
 */
export function trackError(error: Error | string, fatal: boolean = false) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  trackEvent('exception', {
    description: errorMessage,
    fatal,
    stack: errorStack,
  });
}
