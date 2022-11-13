import { TestStatus } from '../TestStatus';

export interface IconToolTipInterface {
  Status: TestStatus;
  Regression: string;
  Build: string;
  Issue: string;
}
