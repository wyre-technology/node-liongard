import { describe, it, expect } from 'vitest';
import {
  LiongardError,
  LiongardAuthenticationError,
  LiongardNotFoundError,
  LiongardValidationError,
  LiongardRateLimitError,
  LiongardServerError,
} from '../../src/errors.js';

describe('Error Classes', () => {
  describe('LiongardError', () => {
    it('should create base error with message and status', () => {
      const err = new LiongardError('Something failed', 500);
      expect(err.message).toBe('Something failed');
      expect(err.statusCode).toBe(500);
      expect(err.name).toBe('LiongardError');
      expect(err instanceof Error).toBe(true);
    });

    it('should default statusCode to 0', () => {
      const err = new LiongardError('Unknown');
      expect(err.statusCode).toBe(0);
    });

    it('should store response data', () => {
      const err = new LiongardError('Fail', 400, { detail: 'bad' });
      expect(err.response).toEqual({ detail: 'bad' });
    });
  });

  describe('LiongardAuthenticationError', () => {
    it('should have 401 status code', () => {
      const err = new LiongardAuthenticationError('Unauthorized');
      expect(err.statusCode).toBe(401);
      expect(err.name).toBe('LiongardAuthenticationError');
      expect(err instanceof LiongardError).toBe(true);
    });
  });

  describe('LiongardNotFoundError', () => {
    it('should have 404 status code', () => {
      const err = new LiongardNotFoundError('Not found');
      expect(err.statusCode).toBe(404);
      expect(err.name).toBe('LiongardNotFoundError');
      expect(err instanceof LiongardError).toBe(true);
    });
  });

  describe('LiongardValidationError', () => {
    it('should have 400 status code and errors array', () => {
      const errors = [{ message: 'Name required', field: 'name' }];
      const err = new LiongardValidationError('Validation failed', errors);
      expect(err.statusCode).toBe(400);
      expect(err.errors).toEqual(errors);
      expect(err.name).toBe('LiongardValidationError');
      expect(err instanceof LiongardError).toBe(true);
    });

    it('should default errors to empty array', () => {
      const err = new LiongardValidationError('Bad');
      expect(err.errors).toEqual([]);
    });
  });

  describe('LiongardRateLimitError', () => {
    it('should have 429 status code and retryAfter', () => {
      const err = new LiongardRateLimitError('Rate limited', 10000);
      expect(err.statusCode).toBe(429);
      expect(err.retryAfter).toBe(10000);
      expect(err.name).toBe('LiongardRateLimitError');
      expect(err instanceof LiongardError).toBe(true);
    });

    it('should default retryAfter to 5000', () => {
      const err = new LiongardRateLimitError('Rate limited');
      expect(err.retryAfter).toBe(5000);
    });
  });

  describe('LiongardServerError', () => {
    it('should handle server errors', () => {
      const err = new LiongardServerError('Internal error', 502);
      expect(err.statusCode).toBe(502);
      expect(err.name).toBe('LiongardServerError');
      expect(err instanceof LiongardError).toBe(true);
    });

    it('should default to 500', () => {
      const err = new LiongardServerError('Server error');
      expect(err.statusCode).toBe(500);
    });
  });
});
