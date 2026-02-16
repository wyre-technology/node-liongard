/**
 * Configuration types and defaults for the Liongard client
 */

export interface RateLimitConfig {
  /** Whether rate limiting is enabled (default: true) */
  enabled: boolean;
  /** Maximum requests per window (default: 300) */
  maxRequests: number;
  /** Window duration in milliseconds (default: 60000) */
  windowMs: number;
  /** Threshold percentage to start throttling (default: 0.8 = 80%) */
  throttleThreshold: number;
  /** Delay between retries on 429 (default: 5000ms) */
  retryAfterMs: number;
  /** Maximum retry attempts on rate limit errors (default: 3) */
  maxRetries: number;
}

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  maxRequests: 300,
  windowMs: 60_000,
  throttleThreshold: 0.8,
  retryAfterMs: 5_000,
  maxRetries: 3,
};

export type ApiVersion = 'v1' | 'v2';

export interface LiongardConfig {
  /** Liongard instance name (subdomain of app.liongard.com) */
  instance: string;
  /** API key for authentication */
  apiKey: string;
  /** Default API version (default: 'v1') */
  apiVersion?: ApiVersion;
  /** Rate limiting configuration */
  rateLimit?: Partial<RateLimitConfig>;
}

export interface ResolvedConfig {
  instance: string;
  apiKey: string;
  apiVersion: ApiVersion;
  baseUrlV1: string;
  baseUrlV2: string;
  rateLimit: RateLimitConfig;
}

export function resolveConfig(config: LiongardConfig): ResolvedConfig {
  if (!config.instance) {
    throw new Error('Instance name is required');
  }
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  const instance = config.instance.trim();
  return {
    instance,
    apiKey: config.apiKey,
    apiVersion: config.apiVersion ?? 'v1',
    baseUrlV1: `https://${instance}.app.liongard.com/api/v1`,
    baseUrlV2: `https://${instance}.app.liongard.com/api/v2`,
    rateLimit: {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      ...config.rateLimit,
    },
  };
}
