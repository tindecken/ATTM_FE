export interface TestClientInterface {
  Id: string;
  Name: string;
  Description: string;
  IPAddress: string;
  Type: string;
  User: string;
  Password: string;
  RegressionFolder: string;
  DevelopFolder: string;
  RunnerFolder: string;
  Status: string;
  DeploySourceStatus?: string;
  DeploySourceMessage?: string;
  UpdateReleaseStatus?: string;
  UpdateReleaseMessage?: string;
}
