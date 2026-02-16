/**
 * Asset Inventory entity types (v2)
 */

export interface Identity {
  ID: number;
  Name: string;
  Email: string | null;
  Type: string;
  Status: string;
  EnvironmentID: number | null;
  LastSeen: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface IdentityUpdateRequest {
  Name?: string;
  Status?: string;
}

export interface DeviceProfile {
  ID: number;
  Name: string;
  Type: string;
  Status: string;
  EnvironmentID: number | null;
  IPAddress: string | null;
  LastSeen: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface DeviceProfileUpdateRequest {
  Name?: string;
  Status?: string;
}

export interface InventoryQueryBody {
  Pagination?: {
    Page: number;
    PageSize: number;
  };
  Filters?: Record<string, unknown>;
}
