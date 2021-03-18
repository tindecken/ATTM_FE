import { TestParamInterface } from './TestParam';

export interface TestStepInterface {
    Id: string;
    TestAUT: string;
    Keyword: string;
    Description: string;
    Params: TestParamInterface[];
    IsDisabled: boolean;
    IsComment: boolean;
}
