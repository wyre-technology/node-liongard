import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server.js';
import { HttpClient } from '../../src/http.js';
import { RateLimiter } from '../../src/rate-limiter.js';
import { resolveConfig, DEFAULT_RATE_LIMIT_CONFIG } from '../../src/config.js';
import {
  LiongardAuthenticationError,
  LiongardNotFoundError,
  LiongardValidationError,
  LiongardServerError,
} from '../../src/errors.js';

const config = resolveConfig({
  instance: 'test-instance',
  apiKey: 'test-api-key',
});
const rateLimiter = new RateLimiter({ ...DEFAULT_RATE_LIMIT_CONFIG, enabled: false });
const httpClient = new HttpClient(config, rateLimiter);

describe('HttpClient', () => {
  it('should make GET requests with auth header', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v1/test', ({ request }) => {
        const apiKey = request.headers.get('X-ROAR-API-KEY');
        return HttpResponse.json({ authenticated: apiKey === 'test-api-key' });
      }),
    );

    const result = await httpClient.request<{ authenticated: boolean }>('/test', 'v1');
    expect(result.authenticated).toBe(true);
  });

  it('should make POST requests with body', async () => {
    server.use(
      http.post('https://test-instance.app.liongard.com/api/v2/test', async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ received: body });
      }),
    );

    const result = await httpClient.request<{ received: unknown }>('/test', 'v2', {
      method: 'POST',
      body: { key: 'value' },
    });
    expect(result.received).toEqual({ key: 'value' });
  });

  it('should append query parameters', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v1/test', ({ request }) => {
        const url = new URL(request.url);
        return HttpResponse.json({
          page: url.searchParams.get('page'),
          pageSize: url.searchParams.get('pageSize'),
        });
      }),
    );

    const result = await httpClient.request<{ page: string; pageSize: string }>('/test', 'v1', {
      params: { page: 2, pageSize: 50 },
    });
    expect(result.page).toBe('2');
    expect(result.pageSize).toBe('50');
  });

  it('should skip undefined query parameters', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v1/test', ({ request }) => {
        const url = new URL(request.url);
        return HttpResponse.json({ hasPage: url.searchParams.has('page') });
      }),
    );

    const result = await httpClient.request<{ hasPage: boolean }>('/test', 'v1', {
      params: { page: undefined },
    });
    expect(result.hasPage).toBe(false);
  });

  it('should throw LiongardAuthenticationError on 401', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v1/auth-test', () => {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    await expect(httpClient.request('/auth-test', 'v1')).rejects.toThrow(LiongardAuthenticationError);
  });

  it('should throw LiongardNotFoundError on 404', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v1/missing', () => {
        return HttpResponse.json({ error: 'Not found' }, { status: 404 });
      }),
    );

    await expect(httpClient.request('/missing', 'v1')).rejects.toThrow(LiongardNotFoundError);
  });

  it('should throw LiongardValidationError on 400', async () => {
    server.use(
      http.post('https://test-instance.app.liongard.com/api/v1/validate', () => {
        return HttpResponse.json({ message: 'Name is required' }, { status: 400 });
      }),
    );

    await expect(
      httpClient.request('/validate', 'v1', { method: 'POST', body: {} }),
    ).rejects.toThrow(LiongardValidationError);
  });

  it('should throw LiongardServerError on 500', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v1/error', () => {
        return HttpResponse.json({ error: 'Internal' }, { status: 500 });
      }),
    );

    await expect(httpClient.request('/error', 'v1')).rejects.toThrow(LiongardServerError);
  });

  it('should use v1 base URL for v1 requests', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v1/version-test', () => {
        return HttpResponse.json({ version: 'v1' });
      }),
    );

    const result = await httpClient.request<{ version: string }>('/version-test', 'v1');
    expect(result.version).toBe('v1');
  });

  it('should use v2 base URL for v2 requests', async () => {
    server.use(
      http.get('https://test-instance.app.liongard.com/api/v2/version-test', () => {
        return HttpResponse.json({ version: 'v2' });
      }),
    );

    const result = await httpClient.request<{ version: string }>('/version-test', 'v2');
    expect(result.version).toBe('v2');
  });

  it('should handle empty responses', async () => {
    server.use(
      http.delete('https://test-instance.app.liongard.com/api/v1/empty', () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const result = await httpClient.request('/empty', 'v1', { method: 'DELETE' });
    expect(result).toEqual({});
  });
});
