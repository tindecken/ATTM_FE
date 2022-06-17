import { UpdateTestCaseDataInterface } from './Entities/UpdateTestCaseData';
import { TestCaseInterface } from './TestCase';

export interface TestCaseHistoryInterface {
  Id?: string;
  TestCase: TestCaseInterface;
  UpdateTestCaseData: UpdateTestCaseDataInterface;
}
