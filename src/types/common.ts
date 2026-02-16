/**
 * Shared types across Liongard entities
 */

export interface FilterCondition {
  path: string;
  op: 'is' | 'not' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
  value: unknown;
}

export interface SortOrder {
  path: string;
  order: 'asc' | 'desc';
}

export interface ListOptions {
  page?: number;
  pageSize?: number;
  conditions?: FilterCondition[];
  orderBy?: SortOrder[];
  fields?: string[];
}
