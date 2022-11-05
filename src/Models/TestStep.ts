import { KeywordInterface } from './Keyword';
import { TestParamInterface } from './TestParam';

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
  Status?: string;
  StartTime?: Date;
  EndTime?: Date;
}
