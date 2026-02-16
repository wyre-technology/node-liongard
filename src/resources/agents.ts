/**
 * Agents resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginationParams, PaginatedResponse } from '../pagination.js';
import { PaginatedPostIterable } from '../pagination.js';
import type { Agent, AgentInstaller } from '../types/agents.js';

export class AgentsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List agents via POST /view-agents (v2) */
  async list(params?: PaginationParams): Promise<PaginatedResponse<Agent>> {
    return this.httpClient.request<PaginatedResponse<Agent>>(
      '/view-agents',
      'v2',
      {
        method: 'POST',
        body: {
          Pagination: {
            Page: params?.page ?? 1,
            PageSize: params?.pageSize ?? 50,
          },
        },
      },
    );
  }

  /** Auto-paginate all agents */
  listAll(pageSize?: number): PaginatedPostIterable<Agent> {
    return new PaginatedPostIterable<Agent>(
      this.httpClient,
      '/view-agents',
      'v2',
      {},
      pageSize ?? 50,
    );
  }

  /** Bulk delete agents (v2) */
  async delete(ids: number[]): Promise<void> {
    await this.httpClient.request<void>('/agents', 'v2', {
      method: 'DELETE',
      body: { AgentIDs: ids },
    });
  }

  /** Generate a dynamic installer (v2) */
  async generateInstaller(): Promise<AgentInstaller> {
    return this.httpClient.request<AgentInstaller>('/agent-installer', 'v2', {
      method: 'POST',
    });
  }
}
