/**
 * Timeline entity types
 */

export interface TimelineEntry {
  ID: number;
  Type: string;
  Action: string;
  Description: string | null;
  EntityType: string | null;
  EntityID: number | null;
  UserID: number | null;
  CreatedOn: string;
}

export interface TimelineQueryBody {
  Pagination?: {
    Page: number;
    PageSize: number;
  };
  Filters?: Record<string, unknown>;
}
