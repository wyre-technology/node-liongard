/**
 * HTTP layer for the Liongard API
 */

import type { ResolvedConfig } from './config.js';
import type { ApiVersion } from './config.js';
import type { RateLimiter } from './rate-limiter.js';
import {
  LiongardError,
  LiongardAuthenticationError,
  LiongardNotFoundError,
  LiongardValidationError,
  LiongardRateLimitError,
  LiongardServerError,
} from './errors.js';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export class HttpClient {
  private readonly config: ResolvedConfig;
  private readonly rateLimiter: RateLimiter;

  constructor(config: ResolvedConfig, rateLimiter: RateLimiter) {
    this.config = config;
    this.rateLimiter = rateLimiter;
  }

  async request<T>(path: string, apiVersion: ApiVersion, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params } = options;
    const baseUrl = apiVersion === 'v2' ? this.config.baseUrlV2 : this.config.baseUrlV1;

    let url = `${baseUrl}${path}`;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.executeRequest<T>(url, method, body);
  }

  private async executeRequest<T>(
    url: string,
    method: string,
    body: unknown,
    retryCount: number = 0,
  ): Promise<T> {
    await this.rateLimiter.waitForSlot();

    const headers: Record<string, string> = {
      'X-ROAR-API-KEY': this.config.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    this.rateLimiter.recordRequest();

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response, url, method, body, retryCount);
  }

  private async handleResponse<T>(
    response: Response,
    url: string,
    method: string,
    body: unknown,
    retryCount: number,
  ): Promise<T> {
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json() as Promise<T>;
      }
      return {} as T;
    }

    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = await response.text();
    }

    switch (response.status) {
      case 400: {
        const errors = this.parseValidationErrors(responseBody);
        throw new LiongardValidationError(
          'Bad request - validation failed',
          errors,
          responseBody,
        );
      }

      case 401:
        throw new LiongardAuthenticationError(
          'Authentication failed - invalid API key',
          responseBody,
        );

      case 404:
        throw new LiongardNotFoundError('Resource not found', responseBody);

      case 429:
        if (this.rateLimiter.shouldRetry(retryCount)) {
          const delay = this.rateLimiter.calculateRetryDelay(retryCount);
          await this.sleep(delay);
          return this.executeRequest<T>(url, method, body, retryCount + 1);
        }
        throw new LiongardRateLimitError(
          'Rate limit exceeded and max retries reached',
          this.config.rateLimit.retryAfterMs,
          responseBody,
        );

      default:
        if (response.status >= 500) {
          if (retryCount === 0) {
            await this.sleep(1000);
            return this.executeRequest<T>(url, method, body, 1);
          }
          throw new LiongardServerError(
            `Server error: ${response.status} ${response.statusText}`,
            response.status,
            responseBody,
          );
        }
        throw new LiongardError(
          `Request failed: ${response.status} ${response.statusText}`,
          response.status,
          responseBody,
        );
    }
  }

  private parseValidationErrors(responseBody: unknown): Array<{ message: string; field?: string }> {
    const errors: Array<{ message: string; field?: string }> = [];

    if (typeof responseBody === 'object' && responseBody !== null) {
      const body = responseBody as Record<string, unknown>;
      if (typeof body['message'] === 'string') {
        errors.push({ message: body['message'] });
      }
      if (typeof body['error'] === 'string') {
        errors.push({ message: body['error'] });
      }
      if (Array.isArray(body['errors'])) {
        for (const err of body['errors']) {
          if (typeof err === 'string') {
            errors.push({ message: err });
          } else if (typeof err === 'object' && err !== null) {
            const errObj = err as Record<string, unknown>;
            errors.push({
              message: String(errObj['message'] ?? errObj['error'] ?? err),
              field: typeof errObj['field'] === 'string' ? errObj['field'] : undefined,
            });
          }
        }
      }
    }

    if (errors.length === 0 && typeof responseBody === 'string') {
      errors.push({ message: responseBody });
    }

    return errors;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
