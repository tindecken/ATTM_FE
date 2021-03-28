import { TestAUTInterface } from './TestAUT';
import { TestParamInterface } from './TestParam';

export interface TestStepInterface {
    UUID: string;
    TestAUT: TestAUTInterface | undefined;
    Keyword: string;
    Description?: string;
    Params: TestParamInterface[];
    IsDisabled?: boolean;
    IsComment?: boolean;
}
