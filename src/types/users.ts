/**
 * User and Group entity types (v1)
 */

export interface User {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
  Status: string;
  MfaFactorAuth: boolean;
  CreatedOn: string;
  UpdatedOn: string;
}

export interface Group {
  ID: number;
  Name: string;
  Description: string | null;
  UserIDs: number[];
  CreatedOn: string;
  UpdatedOn: string;
}
