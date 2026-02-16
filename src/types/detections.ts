/**
 * Detection entity types
 */

export interface Detection {
  ID: number;
  Type: string;
  Severity: string;
  SystemID: number;
  EnvironmentID: number;
  Description: string | null;
  DetectedOn: string;
  ResolvedOn: string | null;
  Status: string;
}

export interface DetectionListBody {
  Pagination?: {
    Page: number;
    PageSize: number;
  };
  Filters?: Record<string, unknown>;
}
