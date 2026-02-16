/**
 * Inspectors resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedIterable, buildPaginationParams } from '../pagination.js';
import type { Inspector } from '../types/inspectors.js';

export class InspectorsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List inspectors (v1) */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Inspector>> {
    return this.httpClient.request<PaginatedResponse<Inspector>>(
      '/inspectors',
      'v1',
      { params: buildPaginationParams(params) },
    );
  }

  /** Auto-paginate all inspectors */
  listAll(pageSize?: number): PaginatedIterable<Inspector> {
    return new PaginatedIterable<Inspector>(
      this.httpClient,
      '/inspectors',
      'v1',
      {},
      pageSize ?? 50,
    );
  }

  /** Get a single inspector by ID (v1) */
  async get(id: number): Promise<Inspector> {
    return this.httpClient.request<Inspector>(`/inspectors/${id}`, 'v1');
  }
}
