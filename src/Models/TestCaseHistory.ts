import { UpdateTestCaseDataInterface } from './Entities/UpdateTestCaseData';
import { TestCaseInterface } from './TestCase';

export interface TestCaseHistoryInterface {
    TestCase: TestCaseInterface
    UpdateTestCaseData: UpdateTestCaseDataInterface
}
