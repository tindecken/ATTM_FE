import { KeywordInterface } from './Keyword';
import { TestAUTInterface } from './TestAUT';
import { TestParamInterface } from './TestParam';

export interface TestStepInterface {
    UUID: string;
    TestAUT: TestAUTInterface;
    Keyword: KeywordInterface;
    Description?: string;
    Params: TestParamInterface[];
    IsDisabled: boolean;
    IsComment: boolean;
}
