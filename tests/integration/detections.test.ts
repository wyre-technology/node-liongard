import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('DetectionsResource', () => {
  it('should list detections', async () => {
    const result = await client.detections.list();
    expect(result.Data).toHaveLength(1);
    expect(result.Data[0]?.Type).toBe('Change');
    expect(result.Data[0]?.Severity).toBe('Medium');
  });

  it('should list detections with pagination', async () => {
    const result = await client.detections.list({ page: 1, pageSize: 10 });
    expect(result.Pagination.CurrentPage).toBe(1);
  });

  it('should auto-paginate all detections', async () => {
    const items = await client.detections.listAll().toArray();
    expect(items).toHaveLength(1);
  });

  it('should accept filters', async () => {
    const result = await client.detections.list(undefined, { Severity: 'High' });
    expect(result.Data).toBeDefined();
  });
});
