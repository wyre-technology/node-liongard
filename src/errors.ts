/**
 * Custom error classes for the Liongard client
 */

export class LiongardError extends Error {
  readonly statusCode: number;
  readonly response: unknown;

  constructor(message: string, statusCode: number = 0, response?: unknown) {
    super(message);
    this.name = 'LiongardError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, LiongardError.prototype);
  }
}

export class LiongardAuthenticationError extends LiongardError {
  constructor(message: string, response?: unknown) {
    super(message, 401, response);
    this.name = 'LiongardAuthenticationError';
    Object.setPrototypeOf(this, LiongardAuthenticationError.prototype);
  }
}

export class LiongardNotFoundError extends LiongardError {
  constructor(message: string, response?: unknown) {
    super(message, 404, response);
    this.name = 'LiongardNotFoundError';
    Object.setPrototypeOf(this, LiongardNotFoundError.prototype);
  }
}

export class LiongardValidationError extends LiongardError {
  readonly errors: Array<{ message: string; field?: string }>;

  constructor(message: string, errors: Array<{ message: string; field?: string }> = [], response?: unknown) {
    super(message, 400, response);
    this.name = 'LiongardValidationError';
    this.errors = errors;
    Object.setPrototypeOf(this, LiongardValidationError.prototype);
  }
}

export class LiongardRateLimitError extends LiongardError {
  readonly retryAfter: number;

  constructor(message: string, retryAfter: number = 5000, response?: unknown) {
    super(message, 429, response);
    this.name = 'LiongardRateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, LiongardRateLimitError.prototype);
  }
}

export class LiongardServerError extends LiongardError {
  constructor(message: string, statusCode: number = 500, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'LiongardServerError';
    Object.setPrototypeOf(this, LiongardServerError.prototype);
  }
}
