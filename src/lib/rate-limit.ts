import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Clean up old entries periodically to prevent memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Rate limiting middleware
 * @param identifier - Unique identifier for the client (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 60, // 60 requests per minute
  }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // No record exists, create one
  if (!record) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    });
    return {
      allowed: true,
      remaining: config.uniqueTokenPerInterval - 1,
      resetTime: now + config.interval,
    };
  }

  // Reset time has passed, reset the counter
  if (now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    });
    return {
      allowed: true,
      remaining: config.uniqueTokenPerInterval - 1,
      resetTime: now + config.interval,
    };
  }

  // Increment the counter
  record.count++;

  // Check if limit exceeded
  if (record.count > config.uniqueTokenPerInterval) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: config.uniqueTokenPerInterval - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get client identifier from request
 * Uses IP address or user session
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from headers (works with most proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // Use forwarded IP if available, otherwise use real IP or fallback
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Rate limit wrapper for API routes
 * Usage:
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const rateLimitResult = await rateLimit(req);
 *   if (rateLimitResult) return rateLimitResult;
 *   
 *   // Continue with your logic
 * }
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  config?: RateLimitConfig
): Promise<NextResponse | null> {
  const identifier = getClientIdentifier(request);
  const result = checkRateLimit(identifier, config);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config?.uniqueTokenPerInterval.toString() || '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        },
      }
    );
  }

  return null; // No rate limit hit, continue processing
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // Strict: For sensitive operations like auth
  STRICT: {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 5,
  },
  
  // Standard: For regular API endpoints
  STANDARD: {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 60,
  },
  
  // Relaxed: For read-only operations
  RELAXED: {
    interval: 60000, // 1 minute
    uniqueTokenPerInterval: 120,
  },
  
  // AI Generation: For expensive AI operations
  AI_GENERATION: {
    interval: 300000, // 5 minutes
    uniqueTokenPerInterval: 10,
  },
};
