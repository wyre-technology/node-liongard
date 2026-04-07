/**
 * Timeline resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams } from '../pagination.js';
import type { TimelineEntry } from '../types/timeline.js';

export class TimelineResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /**
   * List timeline entries via GET /api/v1/timeline.
   *
   * NOTE: Liongard's v2 POST /timelines/query endpoint returns 500 even with
   * the documented Postman body shape, so we use the stable v1 GET endpoint.
   * The v1 endpoint returns a plain JSON array — there is no Pagination
   * envelope. `page`/`pageSize` are forwarded as query params in case the
   * server honors them.
   */
  async list(params?: PaginationParams): Promise<TimelineEntry[]> {
    return this.httpClient.request<TimelineEntry[]>(
      '/timeline',
      'v1',
      {
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 50,
        },
      },
    );
  }
}
