import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('InspectorsResource', () => {
  it('should list inspectors', async () => {
    const result = await client.inspectors.list();
    expect(result.Data).toHaveLength(2);
    expect(result.Data[0]?.Name).toBe('Active Directory');
  });

  it('should get a single inspector', async () => {
    const inspector = await client.inspectors.get(1);
    expect(inspector.ID).toBe(1);
    expect(inspector.Name).toBe('Active Directory');
    expect(inspector.Category).toBe('Identity');
  });

  it('should auto-paginate all inspectors', async () => {
    const items = await client.inspectors.listAll().toArray();
    expect(items).toHaveLength(2);
  });
});
