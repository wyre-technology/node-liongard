/**
 * Alert entity types
 */

export interface Alert {
  ID: number;
  Name: string;
  Type: string;
  Severity: string;
  Status: string;
  EnvironmentID: number | null;
  SystemID: number | null;
  TriggeredOn: string | null;
  CreatedOn: string;
  UpdatedOn: string;
}
