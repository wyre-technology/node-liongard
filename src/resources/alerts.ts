/**
 * Alerts resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedIterable, buildPaginationParams } from '../pagination.js';
import type { Alert } from '../types/alerts.js';

export class AlertsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List alerts (v1) */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Alert>> {
    return this.httpClient.request<PaginatedResponse<Alert>>(
      '/alerts',
      'v1',
      { params: buildPaginationParams(params) },
    );
  }

  /** Auto-paginate all alerts */
  listAll(pageSize?: number): PaginatedIterable<Alert> {
    return new PaginatedIterable<Alert>(
      this.httpClient,
      '/alerts',
      'v1',
      {},
      pageSize ?? 50,
    );
  }

  /** Get a single alert by ID (v1) */
  async get(id: number): Promise<Alert> {
    return this.httpClient.request<Alert>(`/alerts/${id}`, 'v1');
  }
}
