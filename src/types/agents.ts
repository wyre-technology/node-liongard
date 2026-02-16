/**
 * Agent entity types
 */

export interface Agent {
  ID: number;
  Name: string;
  Status: string;
  Version: string;
  LastHeartbeat: string | null;
  IPAddress: string | null;
  EnvironmentID: number | null;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface AgentInstaller {
  URL: string;
  Token: string;
}
