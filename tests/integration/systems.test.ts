import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('SystemsResource', () => {
  it('should list systems', async () => {
    const result = await client.systems.list();
    expect(result.Data).toHaveLength(2);
    expect(result.Data[0]?.Name).toBe('DC01');
  });

  it('should get a single system', async () => {
    const system = await client.systems.get(1);
    expect(system.ID).toBe(1);
    expect(system.Name).toBe('DC01');
    expect(system.InspectorID).toBe(1);
  });

  it('should auto-paginate all systems', async () => {
    const items = await client.systems.listAll().toArray();
    expect(items).toHaveLength(2);
  });
});
