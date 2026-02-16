/**
 * Dataprint entity types (v2)
 */

export interface DataprintEvaluateRequest {
  SystemDetailID: number;
  JMESPath: string;
}

export interface DataprintResult {
  Value: unknown;
}
