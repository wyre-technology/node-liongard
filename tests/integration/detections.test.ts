import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('DetectionsResource', () => {
  it('should list detections (v2 POST, paginated envelope)', async () => {
    const result = await client.detections.list();
    expect(result.Data).toHaveLength(1);
    expect(result.Data[0]?.Type).toBe('Change');
    expect(result.Data[0]?.Severity).toBe('Medium');
    expect(result.Pagination).toBeDefined();
  });

  it('should accept startDate, endDate, filters, and pagination', async () => {
    const result = await client.detections.list({
      page: 1,
      pageSize: 10,
      startDate: '2024-04-01T00:00:00Z',
      endDate: '2024-04-30T00:00:00Z',
      filters: [],
    });
    expect(result.Data).toBeDefined();
    expect(result.Pagination.CurrentPage).toBe(1);
  });

  it('should accept Date objects for startDate/endDate', async () => {
    const result = await client.detections.list({
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
    });
    expect(result.Data).toBeDefined();
  });

  it('should get a single detection by id', async () => {
    const detection = await client.detections.get(1);
    expect(detection.ID).toBe(1);
  });
});
