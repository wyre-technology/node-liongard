import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../../src/rate-limiter.js';
import { DEFAULT_RATE_LIMIT_CONFIG } from '../../src/config.js';

describe('RateLimiter', () => {
  it('should start with zero rate', () => {
    const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);
    expect(limiter.getCurrentRate()).toBe(0);
  });

  it('should report full remaining requests initially', () => {
    const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);
    expect(limiter.getRemainingRequests()).toBe(300);
  });

  it('should track recorded requests', () => {
    const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);
    limiter.recordRequest();
    limiter.recordRequest();
    limiter.recordRequest();
    expect(limiter.getRemainingRequests()).toBe(297);
  });

  it('should calculate current rate correctly', () => {
    const limiter = new RateLimiter({ ...DEFAULT_RATE_LIMIT_CONFIG, maxRequests: 10 });
    limiter.recordRequest();
    limiter.recordRequest();
    expect(limiter.getCurrentRate()).toBeCloseTo(0.2);
  });

  it('should not record requests when disabled', () => {
    const limiter = new RateLimiter({ ...DEFAULT_RATE_LIMIT_CONFIG, enabled: false });
    limiter.recordRequest();
    limiter.recordRequest();
    expect(limiter.getCurrentRate()).toBe(0);
    expect(limiter.getRemainingRequests()).toBe(300);
  });

  it('should resolve waitForSlot immediately when disabled', async () => {
    const limiter = new RateLimiter({ ...DEFAULT_RATE_LIMIT_CONFIG, enabled: false });
    const start = Date.now();
    await limiter.waitForSlot();
    expect(Date.now() - start).toBeLessThan(50);
  });

  it('should resolve waitForSlot immediately when under threshold', async () => {
    const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);
    const start = Date.now();
    await limiter.waitForSlot();
    expect(Date.now() - start).toBeLessThan(50);
  });

  it('should calculate exponential retry delay', () => {
    const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);
    expect(limiter.calculateRetryDelay(0)).toBe(5000);
    expect(limiter.calculateRetryDelay(1)).toBe(10000);
    expect(limiter.calculateRetryDelay(2)).toBe(20000);
    expect(limiter.calculateRetryDelay(3)).toBe(30000); // Capped at 30s
  });

  it('should respect maxRetries for shouldRetry', () => {
    const limiter = new RateLimiter({ ...DEFAULT_RATE_LIMIT_CONFIG, maxRetries: 3 });
    expect(limiter.shouldRetry(0)).toBe(true);
    expect(limiter.shouldRetry(1)).toBe(true);
    expect(limiter.shouldRetry(2)).toBe(true);
    expect(limiter.shouldRetry(3)).toBe(false);
  });
});
