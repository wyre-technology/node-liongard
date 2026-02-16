/**
 * Main Liongard Client
 */

import type { LiongardConfig, ResolvedConfig } from './config.js';
import { resolveConfig } from './config.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import { EnvironmentsResource } from './resources/environments.js';
import { AgentsResource } from './resources/agents.js';
import { SystemsResource } from './resources/systems.js';
import { InspectorsResource } from './resources/inspectors.js';
import { LaunchpointsResource } from './resources/launchpoints.js';
import { DetectionsResource } from './resources/detections.js';
import { AlertsResource } from './resources/alerts.js';
import { MetricsResource } from './resources/metrics.js';
import { TimelineResource } from './resources/timeline.js';
import { InventoryResource } from './resources/inventory.js';
import { WebhooksResource } from './resources/webhooks.js';
import { DataprintsResource } from './resources/dataprints.js';

/**
 * Liongard API Client
 *
 * @example
 * ```typescript
 * const client = new LiongardClient({
 *   instance: 'yourcompany',
 *   apiKey: 'your-api-key',
 * });
 *
 * // List environments
 * const envs = await client.environments.list();
 *
 * // Auto-paginate all systems
 * for await (const system of client.systems.listAll()) {
 *   console.log(system.Name);
 * }
 * ```
 */
export class LiongardClient {
  private readonly config: ResolvedConfig;
  private readonly rateLimiter: RateLimiter;
  private readonly httpClient: HttpClient;

  /** Environment operations */
  readonly environments: EnvironmentsResource;
  /** Agent operations */
  readonly agents: AgentsResource;
  /** System operations */
  readonly systems: SystemsResource;
  /** Inspector operations */
  readonly inspectors: InspectorsResource;
  /** Launchpoint operations */
  readonly launchpoints: LaunchpointsResource;
  /** Detection operations */
  readonly detections: DetectionsResource;
  /** Alert operations */
  readonly alerts: AlertsResource;
  /** Metric operations */
  readonly metrics: MetricsResource;
  /** Timeline operations */
  readonly timeline: TimelineResource;
  /** Asset inventory operations */
  readonly inventory: InventoryResource;
  /** Webhook operations */
  readonly webhooks: WebhooksResource;
  /** Dataprint operations */
  readonly dataprints: DataprintsResource;

  constructor(config: LiongardConfig) {
    this.config = resolveConfig(config);
    this.rateLimiter = new RateLimiter(this.config.rateLimit);
    this.httpClient = new HttpClient(this.config, this.rateLimiter);

    this.environments = new EnvironmentsResource(this.httpClient, this.config);
    this.agents = new AgentsResource(this.httpClient, this.config);
    this.systems = new SystemsResource(this.httpClient, this.config);
    this.inspectors = new InspectorsResource(this.httpClient, this.config);
    this.launchpoints = new LaunchpointsResource(this.httpClient, this.config);
    this.detections = new DetectionsResource(this.httpClient, this.config);
    this.alerts = new AlertsResource(this.httpClient, this.config);
    this.metrics = new MetricsResource(this.httpClient, this.config);
    this.timeline = new TimelineResource(this.httpClient, this.config);
    this.inventory = new InventoryResource(this.httpClient, this.config);
    this.webhooks = new WebhooksResource(this.httpClient, this.config);
    this.dataprints = new DataprintsResource(this.httpClient, this.config);
  }

  getConfig(): Readonly<ResolvedConfig> {
    return this.config;
  }

  getRateLimiterState(): { currentRate: number; remainingRequests: number } {
    return {
      currentRate: this.rateLimiter.getCurrentRate(),
      remainingRequests: this.rateLimiter.getRemainingRequests(),
    };
  }
}
