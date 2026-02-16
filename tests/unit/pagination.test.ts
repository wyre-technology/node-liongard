import { describe, it, expect } from 'vitest';
import { buildPaginationParams } from '../../src/pagination.js';

describe('buildPaginationParams', () => {
  it('should return empty object for undefined', () => {
    expect(buildPaginationParams()).toEqual({});
  });

  it('should return empty object for empty params', () => {
    expect(buildPaginationParams({})).toEqual({});
  });

  it('should include page when provided', () => {
    expect(buildPaginationParams({ page: 2 })).toEqual({ page: 2, pageSize: undefined });
  });

  it('should include pageSize when provided', () => {
    expect(buildPaginationParams({ pageSize: 100 })).toEqual({ page: undefined, pageSize: 100 });
  });

  it('should include both page and pageSize', () => {
    expect(buildPaginationParams({ page: 3, pageSize: 25 })).toEqual({ page: 3, pageSize: 25 });
  });
});
