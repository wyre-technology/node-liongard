import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('DataprintsResource', () => {
  it('should evaluate a JMESPath expression', async () => {
    const result = await client.dataprints.evaluate({
      SystemDetailID: 1,
      JMESPath: 'users[*]',
    });
    expect(result.Value).toBeDefined();
    const value = result.Value as { users: string[] };
    expect(value.users).toContain('admin');
    expect(value.users).toContain('jdoe');
  });
});
