/**
 * Launchpoints resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedIterable, buildPaginationParams } from '../pagination.js';
import type {
  Launchpoint,
  LaunchpointCreateRequest,
  LaunchpointUpdateRequest,
} from '../types/launchpoints.js';

export class LaunchpointsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List launchpoints (v1) */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Launchpoint>> {
    return this.httpClient.request<PaginatedResponse<Launchpoint>>(
      '/launchpoints',
      'v1',
      { params: buildPaginationParams(params) },
    );
  }

  /** Auto-paginate all launchpoints */
  listAll(pageSize?: number): PaginatedIterable<Launchpoint> {
    return new PaginatedIterable<Launchpoint>(
      this.httpClient,
      '/launchpoints',
      'v1',
      {},
      pageSize ?? 50,
    );
  }

  /** Get a single launchpoint by ID (v1) */
  async get(id: number): Promise<Launchpoint> {
    return this.httpClient.request<Launchpoint>(`/launchpoints/${id}`, 'v1');
  }

  /** Create a new launchpoint (v1) */
  async create(data: LaunchpointCreateRequest): Promise<Launchpoint> {
    return this.httpClient.request<Launchpoint>('/launchpoints', 'v1', {
      method: 'POST',
      body: data,
    });
  }

  /** Update a launchpoint (v1) */
  async update(id: number, data: LaunchpointUpdateRequest): Promise<Launchpoint> {
    return this.httpClient.request<Launchpoint>(`/launchpoints/${id}`, 'v1', {
      method: 'PUT',
      body: data,
    });
  }

  /** Trigger an immediate inspection run (v1) */
  async runNow(id: number): Promise<void> {
    await this.httpClient.request<void>(`/launchpoints/${id}/run`, 'v1', {
      method: 'POST',
    });
  }
}
