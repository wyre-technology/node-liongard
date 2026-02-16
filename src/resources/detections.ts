/**
 * Detections resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedPostIterable } from '../pagination.js';
import type { Detection } from '../types/detections.js';

export class DetectionsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List detections via POST (v2) */
  async list(params?: PaginationParams, filters?: Record<string, unknown>): Promise<PaginatedResponse<Detection>> {
    return this.httpClient.request<PaginatedResponse<Detection>>(
      '/detections',
      'v2',
      {
        method: 'POST',
        body: {
          Pagination: {
            Page: params?.page ?? 1,
            PageSize: params?.pageSize ?? 50,
          },
          ...(filters ? { Filters: filters } : {}),
        },
      },
    );
  }

  /** Auto-paginate all detections */
  listAll(filters?: Record<string, unknown>, pageSize?: number): PaginatedPostIterable<Detection> {
    return new PaginatedPostIterable<Detection>(
      this.httpClient,
      '/detections',
      'v2',
      filters ? { Filters: filters } : {},
      pageSize ?? 50,
    );
  }
}
