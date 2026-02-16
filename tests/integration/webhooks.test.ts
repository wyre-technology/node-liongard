import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('WebhooksResource', () => {
  it('should list webhooks', async () => {
    const result = await client.webhooks.list();
    expect(result).toHaveLength(1);
    expect(result[0]?.Name).toBe('Slack Notifications');
  });

  it('should get a single webhook', async () => {
    const wh = await client.webhooks.get(1);
    expect(wh.ID).toBe(1);
    expect(wh.URL).toContain('slack.com');
  });

  it('should create a webhook', async () => {
    const wh = await client.webhooks.create({
      Name: 'Teams Hook',
      URL: 'https://teams.microsoft.com/hook',
      Events: ['detection.created'],
    });
    expect(wh.ID).toBe(2);
    expect(wh.Name).toBe('Teams Hook');
  });

  it('should update a webhook', async () => {
    const wh = await client.webhooks.update(1, { Name: 'Updated Hook' });
    expect(wh.ID).toBe(1);
    expect(wh.Name).toBe('Updated Hook');
  });

  it('should delete a webhook', async () => {
    await expect(client.webhooks.delete(1)).resolves.toBeUndefined();
  });

  it('should generate a signing key', async () => {
    const key = await client.webhooks.generateSigningKey();
    expect(key.Key).toBeTruthy();
  });
});
