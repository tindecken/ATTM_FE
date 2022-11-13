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
  ErrorScreenshot: string;
  Screenshot1: string;
  Screenhost2: string;
  Comments: string;
  TestSteps: TestStepInterface[];
  Buffers?: Record<string, string>;
}
