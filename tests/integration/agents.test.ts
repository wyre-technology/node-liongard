import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('AgentsResource', () => {
  it('should list agents', async () => {
    const result = await client.agents.list();
    expect(result.Data).toHaveLength(2);
    expect(result.Pagination.TotalRows).toBe(2);
    expect(result.Data[0]?.Name).toBe('Agent-01');
  });

  it('should list agents with pagination', async () => {
    const result = await client.agents.list({ page: 1, pageSize: 1 });
    expect(result.Data).toHaveLength(1);
    expect(result.Pagination.HasMoreRows).toBe(true);
  });

  it('should auto-paginate all agents', async () => {
    const items = await client.agents.listAll().toArray();
    expect(items).toHaveLength(2);
  });

  it('should bulk delete agents', async () => {
    await expect(client.agents.delete([1, 2])).resolves.toBeUndefined();
  });

  it('should generate installer', async () => {
    const installer = await client.agents.generateInstaller();
    expect(installer.URL).toContain('liongard.com');
    expect(installer.Token).toBeTruthy();
  });
});
