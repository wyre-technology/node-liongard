/**
 * Inspector entity types
 */

export interface Inspector {
  ID: number;
  Name: string;
  Description: string | null;
  Icon: string | null;
  Category: string | null;
  Version: string | null;
  Status: string;
  CreatedOn: string;
  UpdatedOn: string;
}
