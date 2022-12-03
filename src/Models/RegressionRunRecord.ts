import { TestStepInterface } from './TestStep';

export interface RegressionRunRecordInterface {
  Id: string;
  Status: string;
  Log: string;
  ErrorMessage: string;
  StartAt: Date;
  EndAt: Date;
  ExecuteTime: number;
  RunMachine: string;
  ErrorScreenshotId: string;
  Comments: string;
  TestSteps: TestStepInterface[];
  Buffers?: Record<string, string>;
  IsEvidence?: boolean;
}
