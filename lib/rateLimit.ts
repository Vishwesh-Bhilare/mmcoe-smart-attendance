// lib/rateLimit.ts

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  windowMs: number; // time window in milliseconds
  maxRequests: number; // max requests per window
}

/**
 * Simple in-memory rate limiter.
 * Suitable for serverless with low-scale environments.
 * For production scale, replace with Redis or Upstash.
 */
export function rateLimit(
  key: string,
  options: RateLimitOptions
): { success: boolean; remaining: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.expiresAt) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + options.windowMs,
    });

    return {
      success: true,
      remaining: options.maxRequests - 1,
    };
  }

  if (existing.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
    };
  }

  existing.count += 1;

  return {
    success: true,
    remaining: options.maxRequests - existing.count,
  };
}

/**
 * Helper specifically for attendance submissions.
 */
export function attendanceRateLimit(ip: string) {
  return rateLimit(ip, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  });
}