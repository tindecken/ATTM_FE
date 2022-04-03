export interface RegressionInterface {
  Id: string;
  Name: string;
  Release: string;
  Build: string;
  IsOfficial: boolean;
  IsDeleted: boolean;
  CreatedDate: Date;
  Description: string;
  CreateBy: string;
  LastUpdatedBy?: string;
  StartDate: Date;
  EndDate: Date;
  RegressionTestIds: string[];
  PassRate?: string;
  Total?: number;
  Passed?: number;
  Failed?: number;
  AnalysedPass?: number;
  AnalysedFail?: number;
  Incompatible?: number;
}
