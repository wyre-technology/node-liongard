/**
 * System entity types
 */

export interface System {
  ID: number;
  Name: string;
  InspectorID: number;
  LaunchpointID: number;
  EnvironmentID: number;
  Status: string;
  LastInspection: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}
