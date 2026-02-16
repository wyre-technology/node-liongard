/**
 * node-liongard
 * Comprehensive, fully-typed Node.js/TypeScript library for the Liongard API
 */

export { LiongardClient } from './client.js';

export type { LiongardConfig, RateLimitConfig, ApiVersion } from './config.js';
export { DEFAULT_RATE_LIMIT_CONFIG } from './config.js';

export {
  LiongardError,
  LiongardAuthenticationError,
  LiongardNotFoundError,
  LiongardValidationError,
  LiongardRateLimitError,
  LiongardServerError,
} from './errors.js';

export type { PaginationParams, PaginationMeta, PaginatedResponse } from './pagination.js';
export { PaginatedIterable, PaginatedPostIterable } from './pagination.js';

export * from './types/index.js';
