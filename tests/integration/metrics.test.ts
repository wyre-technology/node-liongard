import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('MetricsResource', () => {
  it('should list metrics', async () => {
    const result = await client.metrics.list();
    expect(result).toHaveLength(1);
    expect(result[0]?.Name).toBe('User Count');
  });

  it('should get related environments', async () => {
    const envs = await client.metrics.getRelatedEnvironments(1);
    expect(envs).toHaveLength(1);
    expect(envs[0]?.Name).toBe('Acme Corp');
  });

  it('should evaluate metrics', async () => {
    const result = await client.metrics.evaluate({
      MetricIDs: [1],
      Pagination: { Page: 1, PageSize: 50 },
    });
    expect(result.Data).toHaveLength(1);
    expect(result.Data[0]?.Value).toBe(42);
  });

  it('should evaluate metrics per system', async () => {
    const result = await client.metrics.evaluateSystems({
      MetricIDs: [1],
      Pagination: { Page: 1, PageSize: 50 },
    });
    expect(result.Data).toHaveLength(1);
    expect(result.Data[0]?.SystemID).toBe(1);
  });
});
