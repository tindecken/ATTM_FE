export interface RegressionInterface {
  Id: string;
  Name: string;
  Build: string;
  IsOfficial: boolean;
  IsDeleted: boolean;
  CreatedDate: Date;
  Description: string;
  CreatedBy: string;
  LastUpdatedBy?: string;
  LastUpdatedDate?: Date;
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
