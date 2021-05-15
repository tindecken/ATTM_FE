import { TestCaseInterface } from './TestCase';

export interface TestCaseDetailInterface extends TestCaseInterface {
    Category: string;
    TestSuite: string;
    TestGroup: string;
}
