import { TestStatus } from '../TestStatus';

export interface LastRegressionResultInterface {
  Build: string;
  Issue: string;
  Regression: string;
  Status: TestStatus;
}
