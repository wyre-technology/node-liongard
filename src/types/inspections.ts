/**
 * Inspection entity types (v1)
 */

export interface Inspection {
  ID: number;
  LaunchpointID: number;
  SystemID: number;
  Status: string;
  StartedOn: string;
  CompletedOn: string | null;
  Duration: number | null;
  CreatedOn: string;
}
