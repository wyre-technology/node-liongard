/**
 * Detections resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import type { Detection } from '../types/detections.js';

const DEFAULT_DETECTIONS_SORTING = [{ SortBy: 'date', Direction: 'DESC' }];
const DEFAULT_LOOKBACK_DAYS = 30;

function toIsoString(value: string | Date | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value instanceof Date) return value.toISOString();
  return value;
}

export interface DetectionListOptions extends PaginationParams {
  /**
   * Optional Liongard `Filters` array. If omitted, defaults to `[]`.
   */
  filters?: Array<Record<string, unknown>>;
  /**
   * Optional Liongard `Sorting` array. Defaults to
   * `[{ SortBy: 'date', Direction: 'DESC' }]`.
   *
   * NOTE: detections uses `SortBy` (not `Field`) — this is inconsistent
   * with other Liongard endpoints, but matches the official Postman spec.
   */
  sorting?: Array<Record<string, unknown>>;
  /**
   * Required by Liongard. ISO-8601 string or `Date`. If omitted, the SDK
   * defaults to 30 days ago.
   */
  startDate?: string | Date;
  /**
   * Required by Liongard. ISO-8601 string or `Date`. If omitted, the SDK
   * defaults to "now".
   */
  endDate?: string | Date;
}

export class DetectionsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /**
   * List detections via POST /api/v2/detections.
   *
   * Liongard requires `StartDate` and `EndDate` in the request body. If the
   * caller does not pass them, the SDK defaults to the last 30 days.
   */
  async list(options?: DetectionListOptions): Promise<PaginatedResponse<Detection>> {
    const now = new Date();
    const lookbackStart = new Date(now.getTime() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

    const startDate = toIsoString(options?.startDate) ?? lookbackStart.toISOString();
    const endDate = toIsoString(options?.endDate) ?? now.toISOString();

    return this.httpClient.request<PaginatedResponse<Detection>>(
      '/detections',
      'v2',
      {
        method: 'POST',
        body: {
          Pagination: {
            Page: options?.page ?? 1,
            PageSize: options?.pageSize ?? 25,
          },
          Filters: options?.filters ?? [],
          Sorting: options?.sorting ?? DEFAULT_DETECTIONS_SORTING,
          StartDate: startDate,
          EndDate: endDate,
        },
      },
    );
  }

  /** Get a single detection by ID (v1) */
  async get(id: number): Promise<Detection> {
    return this.httpClient.request<Detection>(`/detections/${id}`, 'v1');
  }
}
