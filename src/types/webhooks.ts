/**
 * Webhook entity types (v2)
 */

export interface Webhook {
  ID: number;
  Name: string;
  URL: string;
  Events: string[];
  Status: string;
  Secret: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface WebhookCreateRequest {
  Name: string;
  URL: string;
  Events: string[];
}

export interface WebhookUpdateRequest {
  Name?: string;
  URL?: string;
  Events?: string[];
  Status?: string;
}

export interface WebhookSigningKey {
  Key: string;
}
