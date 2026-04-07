/**
 * Timeline resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedPostIterable } from '../pagination.js';
import type { TimelineEntry } from '../types/timeline.js';

const DEFAULT_TIMELINE_FILTERS = [{ Field: 'Latest', Op: 'Match', Value: true }];
const DEFAULT_TIMELINE_SORTING = [{ Field: 'ID', Direction: 'DESC' }];

function normalizeTimelineFilters(
  filters?: Record<string, unknown> | Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  if (!filters) return DEFAULT_TIMELINE_FILTERS;
  const arr = Array.isArray(filters) ? filters : [filters];
  return arr.length === 0 ? DEFAULT_TIMELINE_FILTERS : arr;
}

export class TimelineResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /**
   * List timeline entries via POST /api/v2/timelines/query.
   *
   * Liongard requires at least one filter on this endpoint. If no filters
   * are supplied, the SDK defaults to the canonical "latest entries" filter
   * from Liongard's official Postman collection:
   * `[{Field: "Latest", Op: "Match", Value: true}]`.
   */
  async list(
    params?: PaginationParams,
    filters?: Record<string, unknown> | Array<Record<string, unknown>>,
  ): Promise<PaginatedResponse<TimelineEntry>> {
    return this.httpClient.request<PaginatedResponse<TimelineEntry>>(
      '/timelines/query',
      'v2',
      {
        method: 'POST',
        body: {
          Filters: normalizeTimelineFilters(filters),
          Sorting: DEFAULT_TIMELINE_SORTING,
          Pagination: {
            Page: params?.page ?? 1,
            PageSize: params?.pageSize ?? 50,
          },
        },
      },
    );
  }

  /** Auto-paginate all timeline entries */
  listAll(
    filters?: Record<string, unknown> | Array<Record<string, unknown>>,
    pageSize?: number,
  ): PaginatedPostIterable<TimelineEntry> {
    return new PaginatedPostIterable<TimelineEntry>(
      this.httpClient,
      '/timelines/query',
      'v2',
      {
        Filters: normalizeTimelineFilters(filters),
        Sorting: DEFAULT_TIMELINE_SORTING,
      },
      pageSize ?? 50,
    );
  }
}
