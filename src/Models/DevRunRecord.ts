import { TestStatus } from './TestStatus';
import { TestStepInterface } from './TestStep';

export interface DevRunRecordInterface {
  Id: string;
  TestCaseId: string;
  TestCaseCodeName: string;
  TestCaseName: string;
  TestCaseFullName: string;
  Description: string;
  TestCaseType?: string;
  Status: TestStatus;
  Category?: string;
  TestSuite: string;
  TestGroup: string;
  Team?: string;
  ErrorMessage?: string;
  Log?: string;
  StartAt: Date;
  EndAt?: Date;
  WorkItem?: string;
  ExecuteTime?: number;
  RunMachine?: string;
  ErrorScreenshotId?: string;
  Comments?: string;
  TestSteps: TestStepInterface[];
  Buffers?: Record<string, string>;
  IsEvidence?: boolean;
}
