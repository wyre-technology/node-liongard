import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('DetectionsResource', () => {
  it('should list detections (v1 GET, plain array)', async () => {
    const detections = await client.detections.list();
    expect(Array.isArray(detections)).toBe(true);
    expect(detections).toHaveLength(1);
    expect(detections[0]?.Type).toBe('Change');
    expect(detections[0]?.Severity).toBe('Medium');
  });

  it('should accept conditions and fields', async () => {
    const detections = await client.detections.list({
      conditions: [{ path: 'Inspector/ID', op: '=', value: 3 }],
      fields: ['ID', 'Type', 'Severity'],
    });
    expect(Array.isArray(detections)).toBe(true);
  });

  it('should get a single detection by id', async () => {
    const detection = await client.detections.get(1);
    expect(detection.ID).toBe(1);
  });
});
