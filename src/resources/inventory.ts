/**
 * Asset Inventory resource operations (v2)
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedPostIterable } from '../pagination.js';
import type {
  Identity,
  IdentityUpdateRequest,
  DeviceProfile,
  DeviceProfileUpdateRequest,
} from '../types/inventory.js';

export class InventoryResource {
  readonly identities: IdentitiesSubResource;
  readonly devices: DevicesSubResource;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.identities = new IdentitiesSubResource(httpClient);
    this.devices = new DevicesSubResource(httpClient);
  }
}

class IdentitiesSubResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /** List identities via POST query (v2) */
  async list(params?: PaginationParams, filters?: Record<string, unknown>): Promise<PaginatedResponse<Identity>> {
    return this.httpClient.request<PaginatedResponse<Identity>>(
      '/inventory-identities-query',
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

  /** Auto-paginate all identities */
  listAll(filters?: Record<string, unknown>, pageSize?: number): PaginatedPostIterable<Identity> {
    return new PaginatedPostIterable<Identity>(
      this.httpClient,
      '/inventory-identities-query',
      'v2',
      filters ? { Filters: filters } : {},
      pageSize ?? 50,
    );
  }

  /** Get a single identity by ID (v2) */
  async get(id: number): Promise<Identity> {
    return this.httpClient.request<Identity>(`/inventory-identities/${id}`, 'v2');
  }

  /** Update an identity (v2) */
  async update(id: number, data: IdentityUpdateRequest): Promise<Identity> {
    return this.httpClient.request<Identity>(`/inventory-identities/${id}`, 'v2', {
      method: 'PUT',
      body: data,
    });
  }
}

class DevicesSubResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /** List device profiles via POST query (v2) */
  async list(params?: PaginationParams, filters?: Record<string, unknown>): Promise<PaginatedResponse<DeviceProfile>> {
    return this.httpClient.request<PaginatedResponse<DeviceProfile>>(
      '/inventory-device-profiles-query',
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

  /** Auto-paginate all device profiles */
  listAll(filters?: Record<string, unknown>, pageSize?: number): PaginatedPostIterable<DeviceProfile> {
    return new PaginatedPostIterable<DeviceProfile>(
      this.httpClient,
      '/inventory-device-profiles-query',
      'v2',
      filters ? { Filters: filters } : {},
      pageSize ?? 50,
    );
  }

  /** Get a single device profile by ID (v2) */
  async get(id: number): Promise<DeviceProfile> {
    return this.httpClient.request<DeviceProfile>(`/inventory-device-profiles/${id}`, 'v2');
  }

  /** Update a device profile (v2) */
  async update(id: number, data: DeviceProfileUpdateRequest): Promise<DeviceProfile> {
    return this.httpClient.request<DeviceProfile>(`/inventory-device-profiles/${id}`, 'v2', {
      method: 'PUT',
      body: data,
    });
  }
}
