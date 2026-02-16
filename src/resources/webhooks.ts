/**
 * Webhooks resource operations (v2)
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type {
  Webhook,
  WebhookCreateRequest,
  WebhookUpdateRequest,
  WebhookSigningKey,
} from '../types/webhooks.js';

export class WebhooksResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List webhooks (v2) */
  async list(): Promise<Webhook[]> {
    return this.httpClient.request<Webhook[]>('/webhooks', 'v2');
  }

  /** Get a single webhook by ID (v2) */
  async get(id: number): Promise<Webhook> {
    return this.httpClient.request<Webhook>(`/webhooks/${id}`, 'v2');
  }

  /** Create a new webhook (v2) */
  async create(data: WebhookCreateRequest): Promise<Webhook> {
    return this.httpClient.request<Webhook>('/webhooks', 'v2', {
      method: 'POST',
      body: data,
    });
  }

  /** Update a webhook (v2) */
  async update(id: number, data: WebhookUpdateRequest): Promise<Webhook> {
    return this.httpClient.request<Webhook>(`/webhooks/${id}`, 'v2', {
      method: 'PUT',
      body: data,
    });
  }

  /** Delete a webhook (v2) */
  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/webhooks/${id}`, 'v2', {
      method: 'DELETE',
    });
  }

  /** Generate a webhook signing key (v2) */
  async generateSigningKey(): Promise<WebhookSigningKey> {
    return this.httpClient.request<WebhookSigningKey>('/webhooks-auth', 'v2', {
      method: 'POST',
    });
  }
}
