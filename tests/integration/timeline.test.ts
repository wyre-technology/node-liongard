import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('TimelineResource', () => {
  it('should list timeline entries (v1 GET, plain array)', async () => {
    const entries = await client.timeline.list();
    expect(Array.isArray(entries)).toBe(true);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.Action).toBe('Completed');
  });

  it('should accept page and pageSize params', async () => {
    const entries = await client.timeline.list({ page: 1, pageSize: 10 });
    expect(Array.isArray(entries)).toBe(true);
  });
});
