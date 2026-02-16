import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('AlertsResource', () => {
  it('should list alerts', async () => {
    const result = await client.alerts.list();
    expect(result.Data).toHaveLength(1);
    expect(result.Data[0]?.Name).toBe('High Severity Alert');
  });

  it('should get a single alert', async () => {
    const alert = await client.alerts.get(1);
    expect(alert.ID).toBe(1);
    expect(alert.Severity).toBe('High');
  });

  it('should auto-paginate all alerts', async () => {
    const items = await client.alerts.listAll().toArray();
    expect(items).toHaveLength(1);
  });
});
