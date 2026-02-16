import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

describe('LiongardClient', () => {
  describe('constructor', () => {
    it('should create a client with valid config', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'key-123' });
      expect(client).toBeDefined();
      expect(client.environments).toBeDefined();
      expect(client.agents).toBeDefined();
      expect(client.systems).toBeDefined();
    });

    it('should throw when instance is missing', () => {
      expect(() => new LiongardClient({ instance: '', apiKey: 'key' })).toThrow('Instance name is required');
    });

    it('should throw when apiKey is missing', () => {
      expect(() => new LiongardClient({ instance: 'test', apiKey: '' })).toThrow('API key is required');
    });

    it('should use default API version v1', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'key' });
      expect(client.getConfig().apiVersion).toBe('v1');
    });

    it('should accept custom API version', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'key', apiVersion: 'v2' });
      expect(client.getConfig().apiVersion).toBe('v2');
    });

    it('should build correct base URLs from instance', () => {
      const client = new LiongardClient({ instance: 'mycompany', apiKey: 'key' });
      const config = client.getConfig();
      expect(config.baseUrlV1).toBe('https://mycompany.app.liongard.com/api/v1');
      expect(config.baseUrlV2).toBe('https://mycompany.app.liongard.com/api/v2');
    });

    it('should trim whitespace from instance name', () => {
      const client = new LiongardClient({ instance: '  mycompany  ', apiKey: 'key' });
      expect(client.getConfig().instance).toBe('mycompany');
    });

    it('should use default rate limit config', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'key' });
      const config = client.getConfig();
      expect(config.rateLimit.enabled).toBe(true);
      expect(config.rateLimit.maxRequests).toBe(300);
      expect(config.rateLimit.windowMs).toBe(60000);
    });

    it('should override rate limit config when provided', () => {
      const client = new LiongardClient({
        instance: 'test',
        apiKey: 'key',
        rateLimit: { maxRequests: 200, throttleThreshold: 0.9 },
      });
      const config = client.getConfig();
      expect(config.rateLimit.maxRequests).toBe(200);
      expect(config.rateLimit.throttleThreshold).toBe(0.9);
      expect(config.rateLimit.windowMs).toBe(60000);
    });
  });

  describe('getConfig', () => {
    it('should return readonly config', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'secret' });
      const config = client.getConfig();
      expect(config.apiKey).toBe('secret');
      expect(config.instance).toBe('test');
    });
  });

  describe('getRateLimiterState', () => {
    it('should return initial rate limiter state', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'key' });
      const state = client.getRateLimiterState();
      expect(state.currentRate).toBe(0);
      expect(state.remainingRequests).toBe(300);
    });
  });

  describe('resources', () => {
    it('should expose all resource classes', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'key' });
      expect(client.environments).toBeDefined();
      expect(client.agents).toBeDefined();
      expect(client.systems).toBeDefined();
      expect(client.inspectors).toBeDefined();
      expect(client.launchpoints).toBeDefined();
      expect(client.detections).toBeDefined();
      expect(client.alerts).toBeDefined();
      expect(client.metrics).toBeDefined();
      expect(client.timeline).toBeDefined();
      expect(client.inventory).toBeDefined();
      expect(client.webhooks).toBeDefined();
      expect(client.dataprints).toBeDefined();
    });

    it('should expose inventory sub-resources', () => {
      const client = new LiongardClient({ instance: 'test', apiKey: 'key' });
      expect(client.inventory.identities).toBeDefined();
      expect(client.inventory.devices).toBeDefined();
    });
  });
});
