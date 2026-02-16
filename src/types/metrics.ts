/**
 * Metric entity types
 */

export interface Metric {
  ID: number;
  Name: string;
  Description: string | null;
  Type: string;
  Status: string;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface MetricValue {
  MetricID: number;
  SystemID: number;
  EnvironmentID: number;
  Value: unknown;
  EvaluatedOn: string;
}

export interface MetricEvaluateBody {
  MetricIDs?: number[];
  EnvironmentIDs?: number[];
  Pagination?: {
    Page: number;
    PageSize: number;
  };
}

export interface MetricRelatedEnvironment {
  ID: number;
  Name: string;
}
