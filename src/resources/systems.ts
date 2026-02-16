/**
 * Systems resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedIterable, buildPaginationParams } from '../pagination.js';
import type { System } from '../types/systems.js';

export class SystemsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List systems (v1) */
  async list(params?: PaginationParams): Promise<PaginatedResponse<System>> {
    return this.httpClient.request<PaginatedResponse<System>>(
      '/systems',
      'v1',
      { params: buildPaginationParams(params) },
    );
  }

  /** Auto-paginate all systems */
  listAll(pageSize?: number): PaginatedIterable<System> {
    return new PaginatedIterable<System>(
      this.httpClient,
      '/systems',
      'v1',
      {},
      pageSize ?? 50,
    );
  }

  /** Get a single system by ID (v1) */
  async get(id: number): Promise<System> {
    return this.httpClient.request<System>(`/systems/${id}`, 'v1');
  }
}
