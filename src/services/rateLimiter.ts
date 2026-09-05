/**
 * MicroLink High-Traffic & Anti-DDoS Concurrency Controller
 * Protects server and client from rapid-fire spam, clicking storms, and request flooding.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiterService {
  private history: Map<string, number[]> = new Map();

  private defaultConfigs: Record<string, RateLimitConfig> = {
    "task-create": { maxRequests: 5, windowMs: 60 * 1000 },    // 5 tasks per minute
    "bid-submit": { maxRequests: 12, windowMs: 60 * 1000 },    // 12 bids per minute
    "chat-msg": { maxRequests: 30, windowMs: 60 * 1000 },      // 30 messages per minute
    "auth-attempt": { maxRequests: 5, windowMs: 30 * 1000 },   // 5 login attempts per 30s
    "api-request": { maxRequests: 60, windowMs: 60 * 1000 },   // 60 requests per minute
  };

  /**
   * Check if an action is permitted under the rate limit.
   * Returns { allowed: boolean, remaining: number, retryAfterSec: number }
   */
  public checkLimit(action: string, customConfig?: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    retryAfterSec: number;
  } {
    const config = customConfig || this.defaultConfigs[action] || { maxRequests: 20, windowMs: 60 * 1000 };
    const now = Date.now();
    const timestamps = this.history.get(action) || [];

    // Filter out timestamps outside the current rolling window
    const validTimestamps = timestamps.filter(ts => now - ts < config.windowMs);

    if (validTimestamps.length >= config.maxRequests) {
      const oldestValid = validTimestamps[0];
      const retryAfterSec = Math.max(1, Math.ceil((oldestValid + config.windowMs - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        retryAfterSec,
      };
    }

    validTimestamps.push(now);
    this.history.set(action, validTimestamps);

    return {
      allowed: true,
      remaining: config.maxRequests - validTimestamps.length,
      retryAfterSec: 0,
    };
  }

  /**
   * Reset tracking for a given action (e.g. after successful captcha or logout)
   */
  public reset(action?: string) {
    if (action) {
      this.history.delete(action);
    } else {
      this.history.clear();
    }
  }
}

export const rateLimiter = new RateLimiterService();

/**
 * Throttle utility: Ensures callback is called at most once every waitMs.
 */
export function throttle<T extends (...args: any[]) => void>(fn: T, waitMs: number): T {
  let inThrottle = false;
  let lastArgs: any[] | null = null;

  return ((...args: any[]) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, waitMs);
    } else {
      lastArgs = args;
    }
  }) as T;
}

/**
 * Debounce utility: Delays callback execution until delayMs has elapsed since last call.
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number): T {
  let timeoutId: any = null;
  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  }) as T;
}

/**
 * Exponential backoff execution for network resilience during traffic spikes
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
  factor = 2
): Promise<T> {
  let attempt = 0;
  let currentDelay = delayMs;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= factor;
    }
  }

  throw new Error("Maximum retry attempts exceeded");
}
