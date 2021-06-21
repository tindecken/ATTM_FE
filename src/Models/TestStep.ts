import { KeywordInterface } from './Keyword';
import { TestParamInterface } from './TestParam';

export interface TestStepInterface {
    UUID: string;
    TestAUTId: string;
    Keyword?: KeywordInterface;
    Description?: string;
    Params: TestParamInterface[];
    IsDisabled: boolean;
    IsComment: boolean;
    KWFeature: string;
    KWCategory: string;
    Status: string;
}
