/**
 * Error Monitoring and Reporting
 *
 * Lightweight error tracking without external dependencies.
 * Can be enhanced with Sentry integration if needed.
 */

interface ErrorLog {
  timestamp: Date;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  severity: 'error' | 'warning' | 'info';
  userId?: string;
  url?: string;
  userAgent?: string;
}

class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory
  private sentryEnabled = false;
  private sentryDSN: string | null = null;

  constructor() {
    this.setupGlobalErrorHandler();
    this.setupUnhandledRejectionHandler();
    this.checkSentryConfig();
  }

  /**
   * Check if Sentry is configured
   */
  private checkSentryConfig() {
    this.sentryDSN = import.meta.env.VITE_SENTRY_DSN || null;
    this.sentryEnabled = !!this.sentryDSN;

    if (this.sentryEnabled) {
      console.log('✅ Sentry error monitoring enabled');
      // In production, initialize Sentry SDK here
      // import * as Sentry from "@sentry/react";
      // Sentry.init({ dsn: this.sentryDSN });
    } else {
      console.log('📊 Using local error monitoring (Sentry not configured)');
    }
  }

  /**
   * Setup global error handler
   */
  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        severity: 'error',
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  /**
   * Setup unhandled promise rejection handler
   */
  private setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        severity: 'error',
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  /**
   * Log an error
   */
  logError(error: Partial<ErrorLog>) {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      context: error.context,
      severity: error.severity || 'error',
      userId: error.userId,
      url: error.url || window.location.href,
      userAgent: error.userAgent || navigator.userAgent,
    };

    // Add to in-memory log
    this.errors.push(errorLog);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[Error Monitor]', errorLog);
    }

    // Send to Sentry in production
    if (this.sentryEnabled && import.meta.env.PROD) {
      this.sendToSentry(errorLog);
    }

    // Store critical errors in localStorage for debugging
    if (errorLog.severity === 'error') {
      this.persistError(errorLog);
    }
  }

  /**
   * Send error to Sentry
   */
  private sendToSentry(error: ErrorLog) {
    // In production with Sentry SDK installed:
    // Sentry.captureException(new Error(error.message), {
    //   contexts: {
    //     error: error.context,
    //   },
    //   level: error.severity,
    //   tags: {
    //     url: error.url,
    //   },
    //   user: error.userId ? { id: error.userId } : undefined,
    // });

    console.log('[Sentry] Would send error:', error.message);
  }

  /**
   * Persist error to localStorage
   */
  private persistError(error: ErrorLog) {
    try {
      const stored = localStorage.getItem('error_logs');
      const logs: ErrorLog[] = stored ? JSON.parse(stored) : [];
      logs.push(error);

      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }

      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Get recent errors
   */
  getRecentErrors(count = 10): ErrorLog[] {
    return this.errors.slice(-count);
  }

  /**
   * Get all persisted errors
   */
  getPersistedErrors(): ErrorLog[] {
    try {
      const stored = localStorage.getItem('error_logs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear persisted errors
   */
  clearPersistedErrors() {
    localStorage.removeItem('error_logs');
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: Record<string, unknown>) {
    this.logError({
      message,
      context,
      severity: 'warning',
    });
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: Record<string, unknown>) {
    this.logError({
      message,
      context,
      severity: 'info',
    });
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: string, properties?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      console.log('[Event]', eventName, properties);
    }

    // In production with Sentry:
    // Sentry.addBreadcrumb({
    //   message: eventName,
    //   data: properties,
    // });
  }

  /**
   * Set user context for error tracking
   */
  setUser(userId: string, _email?: string) {
    // In production with Sentry:
    // Sentry.setUser({ id: userId, email });

    console.log('[Monitoring] User context set:', userId);
  }

  /**
   * Clear user context
   */
  clearUser() {
    // In production with Sentry:
    // Sentry.setUser(null);

    console.log('[Monitoring] User context cleared');
  }
}

// Export singleton instance
export const errorMonitor = new ErrorMonitor();

/**
 * Error boundary helper for React components
 */
export function captureComponentError(
  error: Error,
  errorInfo: { componentStack: string }
) {
  errorMonitor.logError({
    message: `React Error: ${error.message}`,
    stack: error.stack,
    context: {
      componentStack: errorInfo.componentStack,
    },
    severity: 'error',
  });
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private marks = new Map<string, number>();

  /**
   * Start performance measurement
   */
  mark(name: string) {
    this.marks.set(name, performance.now());
  }

  /**
   * End performance measurement and log
   */
  measure(name: string, warnThreshold = 1000) {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No mark found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    if (duration > warnThreshold) {
      errorMonitor.logWarning(`Slow operation: ${name}`, {
        duration,
        threshold: warnThreshold,
      });
    }

    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }
}

export const performanceMonitor = new PerformanceMonitor();
