/**
 * Pagination utilities for the Liongard API
 *
 * Liongard uses page-based pagination:
 * - GET requests: `page` + `pageSize` query params
 * - POST requests: `Pagination: { Page, PageSize }` in body
 * - Response includes: `Pagination: { TotalRows, HasMoreRows, CurrentPage, TotalPages, PageSize }`
 * - Max page size: 2000
 */

import type { HttpClient } from './http.js';
import type { ApiVersion } from './config.js';

export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page (default: 50, max: 2000) */
  pageSize?: number;
}

export interface PaginationMeta {
  TotalRows: number;
  HasMoreRows: boolean;
  CurrentPage: number;
  TotalPages: number;
  PageSize: number;
}

export interface PaginatedResponse<T> {
  Data: T[];
  Pagination: PaginationMeta;
}

/**
 * Async iterable wrapper for paginated GET results
 */
export class PaginatedIterable<T> implements AsyncIterable<T> {
  private readonly httpClient: HttpClient;
  private readonly path: string;
  private readonly apiVersion: ApiVersion;
  private readonly baseParams: Record<string, string | number | undefined>;
  private readonly pageSize: number;

  constructor(
    httpClient: HttpClient,
    path: string,
    apiVersion: ApiVersion,
    baseParams: Record<string, string | number | undefined> = {},
    pageSize: number = 50,
  ) {
    this.httpClient = httpClient;
    this.path = path;
    this.apiVersion = apiVersion;
    this.baseParams = baseParams;
    this.pageSize = pageSize;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.httpClient.request<PaginatedResponse<T>>(
        this.path,
        this.apiVersion,
        {
          params: {
            ...this.baseParams,
            page: currentPage,
            pageSize: this.pageSize,
          },
        },
      );

      if (response.Data) {
        for (const item of response.Data) {
          yield item;
        }
      }

      hasMore = response.Pagination?.HasMoreRows ?? false;
      currentPage++;
    }
  }

  async toArray(): Promise<T[]> {
    const items: T[] = [];
    for await (const item of this) {
      items.push(item);
    }
    return items;
  }
}

/**
 * Async iterable wrapper for paginated POST results (v2 style)
 */
export class PaginatedPostIterable<T> implements AsyncIterable<T> {
  private readonly httpClient: HttpClient;
  private readonly path: string;
  private readonly apiVersion: ApiVersion;
  private readonly body: Record<string, unknown>;
  private readonly pageSize: number;

  constructor(
    httpClient: HttpClient,
    path: string,
    apiVersion: ApiVersion,
    body: Record<string, unknown> = {},
    pageSize: number = 50,
  ) {
    this.httpClient = httpClient;
    this.path = path;
    this.apiVersion = apiVersion;
    this.body = body;
    this.pageSize = pageSize;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.httpClient.request<PaginatedResponse<T>>(
        this.path,
        this.apiVersion,
        {
          method: 'POST',
          body: {
            ...this.body,
            Pagination: {
              Page: currentPage,
              PageSize: this.pageSize,
            },
          },
        },
      );

      if (response.Data) {
        for (const item of response.Data) {
          yield item;
        }
      }

      hasMore = response.Pagination?.HasMoreRows ?? false;
      currentPage++;
    }
  }

  async toArray(): Promise<T[]> {
    const items: T[] = [];
    for await (const item of this) {
      items.push(item);
    }
    return items;
  }
}

export function buildPaginationParams(params?: PaginationParams): Record<string, string | number | undefined> {
  if (!params) {
    return {};
  }
  return {
    page: params.page,
    pageSize: params.pageSize,
  };
}
