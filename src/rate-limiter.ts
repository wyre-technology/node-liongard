/**
 * Rate limiting for the Liongard API
 *
 * Conservative default: 300 requests per 60-second rolling window.
 * Liongard does not document rate limits, so this is a safe starting point.
 */

import type { RateLimitConfig } from './config.js';

export class RateLimiter {
  private readonly config: RateLimitConfig;
  private requestTimestamps: number[] = [];

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async waitForSlot(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    this.pruneOldTimestamps();

    const currentRate = this.requestTimestamps.length / this.config.maxRequests;

    if (currentRate >= this.config.throttleThreshold) {
      const delayMs = Math.min(
        1000 * (currentRate - this.config.throttleThreshold + 0.1) * 10,
        5000,
      );
      await this.sleep(delayMs);
    }

    if (this.requestTimestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = this.requestTimestamps[0];
      if (oldestTimestamp !== undefined) {
        const waitUntil = oldestTimestamp + this.config.windowMs;
        const waitTime = waitUntil - Date.now();
        if (waitTime > 0) {
          await this.sleep(waitTime);
        }
      }
    }
  }

  recordRequest(): void {
    if (!this.config.enabled) {
      return;
    }
    this.requestTimestamps.push(Date.now());
  }

  getCurrentRate(): number {
    this.pruneOldTimestamps();
    return this.requestTimestamps.length / this.config.maxRequests;
  }

  getRemainingRequests(): number {
    this.pruneOldTimestamps();
    return Math.max(0, this.config.maxRequests - this.requestTimestamps.length);
  }

  calculateRetryDelay(retryCount: number): number {
    return Math.min(
      this.config.retryAfterMs * Math.pow(2, retryCount),
      30_000,
    );
  }

  shouldRetry(retryCount: number): boolean {
    return retryCount < this.config.maxRetries;
  }

  private pruneOldTimestamps(): void {
    const cutoff = Date.now() - this.config.windowMs;
    this.requestTimestamps = this.requestTimestamps.filter(ts => ts > cutoff);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
