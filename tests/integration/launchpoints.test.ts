import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('LaunchpointsResource', () => {
  it('should list launchpoints', async () => {
    const result = await client.launchpoints.list();
    expect(result.Data).toHaveLength(1);
    expect(result.Data[0]?.Name).toBe('Acme AD');
  });

  it('should get a single launchpoint', async () => {
    const lp = await client.launchpoints.get(1);
    expect(lp.ID).toBe(1);
    expect(lp.InspectorID).toBe(1);
    expect(lp.EnvironmentID).toBe(1);
  });

  it('should create a launchpoint', async () => {
    const lp = await client.launchpoints.create({
      Name: 'New LP',
      InspectorID: 2,
      EnvironmentID: 1,
    });
    expect(lp.ID).toBe(2);
    expect(lp.Name).toBe('New LP');
  });

  it('should update a launchpoint', async () => {
    const lp = await client.launchpoints.update(1, { Name: 'Updated LP' });
    expect(lp.ID).toBe(1);
    expect(lp.Name).toBe('Updated LP');
  });

  it('should trigger run now', async () => {
    await expect(client.launchpoints.runNow(1)).resolves.toBeUndefined();
  });

  it('should auto-paginate all launchpoints', async () => {
    const items = await client.launchpoints.listAll().toArray();
    expect(items).toHaveLength(1);
  });
});
