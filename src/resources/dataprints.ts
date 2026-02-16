/**
 * Dataprints resource operations (v2)
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { DataprintEvaluateRequest, DataprintResult } from '../types/dataprints.js';

export class DataprintsResource {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, _config: ResolvedConfig) {
    this.httpClient = httpClient;
  }

  /** Evaluate a JMESPath expression against a system detail (v2) */
  async evaluate(data: DataprintEvaluateRequest): Promise<DataprintResult> {
    return this.httpClient.request<DataprintResult>(
      '/dataprints-evaluate-systemdetailid',
      'v2',
      { method: 'POST', body: data },
    );
  }
}
