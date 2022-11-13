import { KeywordInterface } from './Keyword';
import { TestParamInterface } from './TestParam';
import { TestStatus } from './TestStatus';

export interface TestStepInterface {
  UUID: string;
  TestAUTId: string;
  Keyword?: KeywordInterface;
  Description?: string;
  Params: TestParamInterface[];
  IsDisabled: boolean;
  KWFeature: string;
  KWCategory: string;
  Log?: string;
  Status?: TestStatus;
  StartTime?: Date;
  EndTime?: Date;
}
