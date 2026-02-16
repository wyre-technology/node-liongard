/**
 * Metrics resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginatedResponse } from '../pagination.js';
import type { Metric, MetricValue, MetricEvaluateBody, MetricRelatedEnvironment } from '../types/metrics.js';

export class MetricsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** List metrics (v2 GET) */
  async list(): Promise<Metric[]> {
    return this.httpClient.request<Metric[]>('/metrics', 'v2');
  }

  /** Get related environments for a metric (v2) */
  async getRelatedEnvironments(id: number): Promise<MetricRelatedEnvironment[]> {
    return this.httpClient.request<MetricRelatedEnvironment[]>(
      `/metrics/${id}/relatedenvironments`,
      'v2',
    );
  }

  /** Evaluate metrics for all systems (v2 POST) */
  async evaluate(body: MetricEvaluateBody): Promise<PaginatedResponse<MetricValue>> {
    return this.httpClient.request<PaginatedResponse<MetricValue>>(
      '/metrics-evaluate',
      'v2',
      { method: 'POST', body },
    );
  }

  /** Evaluate metrics per system (v2 POST) */
  async evaluateSystems(body: MetricEvaluateBody): Promise<PaginatedResponse<MetricValue>> {
    return this.httpClient.request<PaginatedResponse<MetricValue>>(
      '/metrics-evaluate-systems',
      'v2',
      { method: 'POST', body },
    );
  }
}
