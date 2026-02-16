/**
 * Launchpoint entity types
 */

export interface Launchpoint {
  ID: number;
  Name: string;
  InspectorID: number;
  EnvironmentID: number;
  AgentID: number | null;
  Schedule: string | null;
  Status: string;
  LastRun: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface LaunchpointCreateRequest {
  Name: string;
  InspectorID: number;
  EnvironmentID: number;
  AgentID?: number;
  Schedule?: string;
  Config?: Record<string, unknown>;
}

export interface LaunchpointUpdateRequest {
  Name?: string;
  Schedule?: string;
  AgentID?: number;
  Config?: Record<string, unknown>;
}
