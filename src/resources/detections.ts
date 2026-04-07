/**
 * Detections resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { Detection } from '../types/detections.js';

export interface DetectionListOptions {
  /**
   * Liongard query conditions. Each condition is an object such as
   * `{ path: 'Inspector/ID', op: '=', value: 3 }`. Serialized as
   * repeated `conditions[]` query params.
   */
  conditions?: Array<Record<string, unknown>>;
  /**
   * Field projection list. Serialized as repeated `fields[]` query params.
   */
  fields?: string[];
}

export class DetectionsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /**
   * List detections via GET /api/v1/detections.
   *
   * The Liongard v1 detections endpoint returns a plain JSON array, not a
   * paginated envelope. Pass `conditions` and `fields` to filter and project.
   */
  async list(options?: DetectionListOptions): Promise<Detection[]> {
    const params: Record<string, string | number | boolean | undefined | Array<string | number>> = {};
    if (options?.conditions && options.conditions.length > 0) {
      params['conditions[]'] = options.conditions.map(c => JSON.stringify(c));
    }
    if (options?.fields && options.fields.length > 0) {
      params['fields[]'] = options.fields;
    }
    return this.httpClient.request<Detection[]>('/detections', 'v1', { params });
  }

  /** Get a single detection by ID (v1) */
  async get(id: number): Promise<Detection> {
    return this.httpClient.request<Detection>(`/detections/${id}`, 'v1');
  }
}
