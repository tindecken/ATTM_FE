import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';

export interface TestCaseStateInterface {
  openedTCs: TestCaseInterface[];
  allTestCasesDetail: TestCaseDetailInterface[];
  selectedTestCaseId: string;
  selectedTestCasesDetail: TestCaseDetailInterface[];
}

const state: TestCaseStateInterface = {
  openedTCs: [],
  selectedTestCaseId: '',
  allTestCasesDetail: [],
  selectedTestCasesDetail: [],
};

export default state;
