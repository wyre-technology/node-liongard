import { describe, it, expect } from 'vitest';
import { resolveConfig, DEFAULT_RATE_LIMIT_CONFIG } from '../../src/config.js';

describe('resolveConfig', () => {
  it('should resolve valid config with defaults', () => {
    const config = resolveConfig({ instance: 'myco', apiKey: 'key-123' });
    expect(config.instance).toBe('myco');
    expect(config.apiKey).toBe('key-123');
    expect(config.apiVersion).toBe('v1');
    expect(config.baseUrlV1).toBe('https://myco.app.liongard.com/api/v1');
    expect(config.baseUrlV2).toBe('https://myco.app.liongard.com/api/v2');
    expect(config.rateLimit).toEqual(DEFAULT_RATE_LIMIT_CONFIG);
  });

  it('should throw on empty instance', () => {
    expect(() => resolveConfig({ instance: '', apiKey: 'key' })).toThrow('Instance name is required');
  });

  it('should throw on empty apiKey', () => {
    expect(() => resolveConfig({ instance: 'myco', apiKey: '' })).toThrow('API key is required');
  });

  it('should accept v2 API version', () => {
    const config = resolveConfig({ instance: 'myco', apiKey: 'key', apiVersion: 'v2' });
    expect(config.apiVersion).toBe('v2');
  });

  it('should merge partial rate limit config', () => {
    const config = resolveConfig({
      instance: 'myco',
      apiKey: 'key',
      rateLimit: { maxRequests: 100 },
    });
    expect(config.rateLimit.maxRequests).toBe(100);
    expect(config.rateLimit.windowMs).toBe(60000);
    expect(config.rateLimit.enabled).toBe(true);
  });

  it('should trim instance whitespace', () => {
    const config = resolveConfig({ instance: '  spaced  ', apiKey: 'key' });
    expect(config.instance).toBe('spaced');
    expect(config.baseUrlV1).toBe('https://spaced.app.liongard.com/api/v1');
  });
});
