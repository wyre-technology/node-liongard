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

  it('should list with pagination', async () => {
    const result = await client.timeline.list({ page: 1, pageSize: 10 });
    expect(result.Pagination.CurrentPage).toBe(1);
  });

  it('should auto-paginate all entries', async () => {
    const items = await client.timeline.listAll().toArray();
    expect(items).toHaveLength(1);
  });

  it('should accept filters', async () => {
    const result = await client.timeline.list(undefined, { Type: 'Inspection' });
    expect(result.Data).toBeDefined();
  });
});
