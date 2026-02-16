/**
 * Environments resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedIterable, buildPaginationParams } from '../pagination.js';
import type { ListOptions } from '../types/common.js';
import type {
  Environment,
  EnvironmentCreateRequest,
  EnvironmentUpdateRequest,
  EnvironmentRelatedEntities,
  EnvironmentGroup,
  EnvironmentGroupCreateRequest,
  EnvironmentGroupUpdateRequest,
} from '../types/environments.js';

export class EnvironmentsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List environments with pagination (v2 GET) */
  async list(params?: ListOptions): Promise<PaginatedResponse<Environment>> {
    const queryParams: Record<string, string | number | undefined> = {
      ...buildPaginationParams(params),
    };
    if (params?.fields) {
      // Fields are passed as repeated params: fields[]=Name&fields[]=ID
      // HttpClient handles this via URLSearchParams
    }
    return this.httpClient.request<PaginatedResponse<Environment>>(
      '/environments',
      'v2',
      { params: queryParams },
    );
  }

  /** Auto-paginate all environments */
  listAll(params?: Omit<PaginationParams, 'page'>): PaginatedIterable<Environment> {
    return new PaginatedIterable<Environment>(
      this.httpClient,
      '/environments',
      'v2',
      {},
      params?.pageSize ?? 50,
    );
  }

  /** Get a single environment by ID (v2) */
  async get(id: number): Promise<Environment> {
    return this.httpClient.request<Environment>(`/environments/${id}`, 'v2');
  }

  /** Create a new environment (v2) */
  async create(data: EnvironmentCreateRequest): Promise<Environment> {
    return this.httpClient.request<Environment>('/environments', 'v2', {
      method: 'POST',
      body: data,
    });
  }

  /** Update an environment (v2) */
  async update(id: number, data: EnvironmentUpdateRequest): Promise<Environment> {
    return this.httpClient.request<Environment>(`/environments/${id}`, 'v2', {
      method: 'PUT',
      body: data,
    });
  }

  /** Delete an environment (v2) */
  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/environments/${id}`, 'v2', {
      method: 'DELETE',
    });
  }

  /** Get environment count (v2) */
  async count(): Promise<number> {
    return this.httpClient.request<number>('/environments-count', 'v2');
  }

  /** Get related entities for an environment (v2) */
  async getRelatedEntities(id: number): Promise<EnvironmentRelatedEntities> {
    return this.httpClient.request<EnvironmentRelatedEntities>(
      `/environments/${id}/relatedentities`,
      'v2',
    );
  }

  /** List environment groups (v2) */
  async listGroups(): Promise<EnvironmentGroup[]> {
    return this.httpClient.request<EnvironmentGroup[]>('/environment-groups', 'v2');
  }

  /** Create an environment group (v2) */
  async createGroup(data: EnvironmentGroupCreateRequest): Promise<EnvironmentGroup> {
    return this.httpClient.request<EnvironmentGroup>('/environment-groups', 'v2', {
      method: 'POST',
      body: data,
    });
  }

  /** Update an environment group (v2) */
  async updateGroup(id: number, data: EnvironmentGroupUpdateRequest): Promise<EnvironmentGroup> {
    return this.httpClient.request<EnvironmentGroup>(`/environment-groups/${id}`, 'v2', {
      method: 'PUT',
      body: data,
    });
  }

  /** Delete an environment group (v2) */
  async deleteGroup(id: number): Promise<void> {
    await this.httpClient.request<void>('/environment-groups', 'v2', {
      method: 'DELETE',
      body: { ID: id },
    });
  }
}
