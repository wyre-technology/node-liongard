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

export interface InventoryListParams extends PaginationParams {
  /** Liongard Environment ID — REQUIRED by the v2 inventory query endpoints. */
  environment: number;
  /**
   * Optional Liongard query filters. Pass either a single filter object
   * or an array of filter objects. Defaults to `[]`.
   */
  filters?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Optional sorting array. Defaults to `[]`. */
  sorting?: Array<Record<string, unknown>>;
}

function normalizeFilters(
  filters?: Record<string, unknown> | Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  if (!filters) return [];
  return Array.isArray(filters) ? filters : [filters];
}

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

  /**
   * List identities via POST /api/v2/inventory/identities/query.
   *
   * `environment` is required by Liongard.
   */
  async list(params: InventoryListParams): Promise<PaginatedResponse<Identity>> {
    return this.httpClient.request<PaginatedResponse<Identity>>(
      '/inventory/identities/query',
      'v2',
      {
        method: 'POST',
        body: {
          Environment: params.environment,
          Filters: normalizeFilters(params.filters),
          Pagination: {
            Page: params.page ?? 1,
            PageSize: params.pageSize ?? 50,
          },
          Sorting: params.sorting ?? [],
        },
      },
    );
  }

  /** Auto-paginate all identities for a given environment. */
  listAll(params: Omit<InventoryListParams, 'page'>): PaginatedPostIterable<Identity> {
    return new PaginatedPostIterable<Identity>(
      this.httpClient,
      '/inventory/identities/query',
      'v2',
      {
        Environment: params.environment,
        Filters: normalizeFilters(params.filters),
        Sorting: params.sorting ?? [],
      },
      params.pageSize ?? 50,
    );
  }

  /** Get a single identity by ID (v2) */
  async get(id: number): Promise<Identity> {
    return this.httpClient.request<Identity>(`/inventory/identities/${id}`, 'v2');
  }

  /** Update an identity (v2) */
  async update(id: number, data: IdentityUpdateRequest): Promise<Identity> {
    return this.httpClient.request<Identity>(`/inventory/identities/${id}`, 'v2', {
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

  /**
   * List device profiles via POST /api/v2/inventory/device-profiles/query.
   *
   * `environment` is required by Liongard.
   */
  async list(params: InventoryListParams): Promise<PaginatedResponse<DeviceProfile>> {
    return this.httpClient.request<PaginatedResponse<DeviceProfile>>(
      '/inventory/device-profiles/query',
      'v2',
      {
        method: 'POST',
        body: {
          Environment: params.environment,
          Filters: normalizeFilters(params.filters),
          Pagination: {
            Page: params.page ?? 1,
            PageSize: params.pageSize ?? 50,
          },
          Sorting: params.sorting ?? [],
        },
      },
    );
  }

  /** Auto-paginate all device profiles for a given environment. */
  listAll(params: Omit<InventoryListParams, 'page'>): PaginatedPostIterable<DeviceProfile> {
    return new PaginatedPostIterable<DeviceProfile>(
      this.httpClient,
      '/inventory/device-profiles/query',
      'v2',
      {
        Environment: params.environment,
        Filters: normalizeFilters(params.filters),
        Sorting: params.sorting ?? [],
      },
      params.pageSize ?? 50,
    );
  }

  /** Get a single device profile by ID (v2) */
  async get(id: number): Promise<DeviceProfile> {
    return this.httpClient.request<DeviceProfile>(`/inventory/device-profiles/${id}`, 'v2');
  }

  /** Update a device profile (v2) */
  async update(id: number, data: DeviceProfileUpdateRequest): Promise<DeviceProfile> {
    return this.httpClient.request<DeviceProfile>(`/inventory/device-profiles/${id}`, 'v2', {
      method: 'PUT',
      body: data,
    });
  }
}
