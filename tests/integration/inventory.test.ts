import { describe, it, expect } from 'vitest';
import { LiongardClient } from '../../src/client.js';

const client = new LiongardClient({
  instance: 'test-instance',
  apiKey: 'test-api-key',
  rateLimit: { enabled: false },
});

describe('InventoryResource', () => {
  describe('identities', () => {
    it('should list identities', async () => {
      const result = await client.inventory.identities.list();
      expect(result.Data).toHaveLength(1);
      expect(result.Data[0]?.Name).toBe('John Doe');
    });

    it('should get a single identity', async () => {
      const identity = await client.inventory.identities.get(1);
      expect(identity.ID).toBe(1);
      expect(identity.Email).toBe('john@acme.com');
    });

    it('should update an identity', async () => {
      const identity = await client.inventory.identities.update(1, { Name: 'Jane Doe' });
      expect(identity.ID).toBe(1);
      expect(identity.Name).toBe('Jane Doe');
    });

    it('should auto-paginate all identities', async () => {
      const items = await client.inventory.identities.listAll().toArray();
      expect(items).toHaveLength(1);
    });
  });

  describe('devices', () => {
    it('should list device profiles', async () => {
      const result = await client.inventory.devices.list();
      expect(result.Data).toHaveLength(1);
      expect(result.Data[0]?.Name).toBe('DC01');
    });

    it('should get a single device profile', async () => {
      const device = await client.inventory.devices.get(1);
      expect(device.ID).toBe(1);
      expect(device.Type).toBe('Server');
    });

    it('should update a device profile', async () => {
      const device = await client.inventory.devices.update(1, { Name: 'DC02' });
      expect(device.ID).toBe(1);
      expect(device.Name).toBe('DC02');
    });

    it('should auto-paginate all device profiles', async () => {
      const items = await client.inventory.devices.listAll().toArray();
      expect(items).toHaveLength(1);
    });
  });
});
