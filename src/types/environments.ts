/**
 * Environment entity types
 */

export interface Environment {
  ID: number;
  Name: string;
  Description: string | null;
  Status: string;
  Visible: boolean;
  Tier: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface EnvironmentCreateRequest {
  Name: string;
  Description?: string;
  Status?: string;
  Visible?: boolean;
  Tier?: string;
}

export interface EnvironmentUpdateRequest {
  Name?: string;
  Description?: string;
  Status?: string;
  Visible?: boolean;
  Tier?: string;
}

export interface EnvironmentRelatedEntities {
  ID: number;
  Launchpoints: Array<{ ID: number; Name: string }>;
  Agents: Array<{ ID: number; Name: string }>;
  IntegrationMappings: Array<{ ID: number }>;
  ChildEnvironments: Array<{ ID: number; Name: string }>;
}

export interface EnvironmentGroup {
  ID: number;
  Name: string;
  Description: string | null;
  EnvironmentIDs: number[];
}

export interface EnvironmentGroupCreateRequest {
  Name: string;
  Description?: string;
  EnvironmentIDs?: number[];
}

export interface EnvironmentGroupUpdateRequest {
  Name?: string;
  Description?: string;
  EnvironmentIDs?: number[];
}
