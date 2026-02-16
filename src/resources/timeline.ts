/**
 * Timeline resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedPostIterable } from '../pagination.js';
import type { TimelineEntry } from '../types/timeline.js';

export class TimelineResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List timeline entries via POST (v2) */
  async list(params?: PaginationParams, filters?: Record<string, unknown>): Promise<PaginatedResponse<TimelineEntry>> {
    return this.httpClient.request<PaginatedResponse<TimelineEntry>>(
      '/timelines-query',
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

  /** Auto-paginate all timeline entries */
  listAll(filters?: Record<string, unknown>, pageSize?: number): PaginatedPostIterable<TimelineEntry> {
    return new PaginatedPostIterable<TimelineEntry>(
      this.httpClient,
      '/timelines-query',
      'v2',
      filters ? { Filters: filters } : {},
      pageSize ?? 50,
    );
  }
}
