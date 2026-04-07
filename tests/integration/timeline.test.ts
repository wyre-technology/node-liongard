import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('TimelineResource', () => {
  it('should list timeline entries', async () => {
    const result = await client.timeline.list();
    expect(result.Data).toHaveLength(1);
    expect(result.Data[0]?.Action).toBe('Completed');
  });

  it('should accept filters', async () => {
    const result = await client.timeline.list(undefined, { Type: 'Inspection' });
    expect(result.Data).toBeDefined();
  });

  it('should accept array of filters', async () => {
    const result = await client.timeline.list(undefined, [
      { Field: 'Latest', Op: 'Match', Value: true },
    ]);
    expect(result.Data).toBeDefined();
  });
});
