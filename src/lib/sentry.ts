/**
 * Sentry Error Tracking Configuration
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 * 4. Uncomment the code below
 */

// import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  // Only initialize in production or when explicitly enabled
  if (process.env.NODE_ENV !== 'production' && !process.env.SENTRY_ENABLED) {
    return;
  }

  // Uncomment after installing @sentry/nextjs
  /*
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.1,
    
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Environment
    environment: process.env.NODE_ENV,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION,
    
    // Filter sensitive data
    beforeSend(event, hint) {
      // Don't send events in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLED) {
        return null;
      }
      
      // Filter out sensitive information
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }
      
      // Filter out specific errors
      if (event.exception) {
        const exceptionValue = event.exception.values?.[0]?.value || '';
        
        // Ignore common non-critical errors
        if (
          exceptionValue.includes('Network request failed') ||
          exceptionValue.includes('Failed to fetch')
        ) {
          return null;
        }
      }
      
      return event;
    },
    
    // Integrations
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: ['localhost', /^https:\/\/yoursite\.com\/api/],
      }),
      new Sentry.Replay({
        // Mask all text content, can be overridden per element
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      // Facebook
      'fb_xd_fragment',
      // Network errors
      'NetworkError',
      'Network request failed',
    ],
  });
  */
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  console.error('Error captured:', error, context);
  
  // Uncomment after installing @sentry/nextjs
  /*
  Sentry.captureException(error, {
    extra: context,
  });
  */
}

/**
 * Capture message for non-error tracking
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}] ${message}`);
  
  // Uncomment after installing @sentry/nextjs
  /*
  Sentry.captureMessage(message, level);
  */
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; name?: string } | null) {
  // Uncomment after installing @sentry/nextjs
  /*
  Sentry.setUser(user);
  */
}

/**
 * Add breadcrumb for better error context
 */
export function addBreadcrumb(message: string, category?: string, data?: Record<string, unknown>) {
  // Uncomment after installing @sentry/nextjs
  /*
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
  */
}

// Initialize Sentry when this module is imported
// initSentry();
