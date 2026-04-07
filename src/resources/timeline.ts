/**
 * Timeline resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
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
   * IMPORTANT: Liongard's timeline query endpoint does NOT accept a
   * `Pagination` object in the request body — passing one yields a 500.
   * The endpoint returns all matching rows for the supplied filters; the
   * `Pagination` block on the response is informational only.
   *
   * The `params` argument is accepted for API stability but is currently
   * ignored, since this endpoint is not paginated server-side.
   */
  async list(
    _params?: PaginationParams,
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
        },
      },
    );
  }
}
