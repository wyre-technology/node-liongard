import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('EnvironmentsResource', () => {
  it('should list environments', async () => {
    const result = await client.environments.list();
    expect(result.Data).toHaveLength(3);
    expect(result.Pagination.TotalRows).toBe(3);
    expect(result.Data[0]?.Name).toBe('Acme Corp');
  });

  it('should get a single environment', async () => {
    const env = await client.environments.get(1);
    expect(env.ID).toBe(1);
    expect(env.Name).toBe('Acme Corp');
    expect(env.Status).toBe('Active');
  });

  it('should create an environment', async () => {
    const env = await client.environments.create({ Name: 'New Corp', Description: 'New client' });
    expect(env.ID).toBe(4);
    expect(env.Name).toBe('New Corp');
  });

  it('should update an environment', async () => {
    const env = await client.environments.update(1, { Name: 'Acme Corp Updated' });
    expect(env.ID).toBe(1);
    expect(env.Name).toBe('Acme Corp Updated');
  });

  it('should delete an environment', async () => {
    await expect(client.environments.delete(1)).resolves.toBeUndefined();
  });

  it('should get environment count', async () => {
    const count = await client.environments.count();
    expect(count).toBe(3);
  });

  it('should get related entities', async () => {
    const related = await client.environments.getRelatedEntities(1);
    expect(related.ID).toBe(1);
    expect(related.Launchpoints).toHaveLength(1);
    expect(related.Agents).toHaveLength(1);
  });

  it('should list environment groups', async () => {
    const groups = await client.environments.listGroups();
    expect(groups).toHaveLength(1);
    expect(groups[0]?.Name).toBe('Production');
  });

  it('should create an environment group', async () => {
    const group = await client.environments.createGroup({ Name: 'Staging' });
    expect(group.ID).toBe(2);
    expect(group.Name).toBe('Staging');
  });

  it('should update an environment group', async () => {
    const group = await client.environments.updateGroup(1, { Name: 'Prod Updated' });
    expect(group.ID).toBe(1);
    expect(group.Name).toBe('Prod Updated');
  });

  it('should delete an environment group', async () => {
    await expect(client.environments.deleteGroup(1)).resolves.toBeUndefined();
  });

  it('should auto-paginate all environments', async () => {
    const items = await client.environments.listAll().toArray();
    expect(items).toHaveLength(3);
    expect(items[0]?.Name).toBe('Acme Corp');
  });
});
