import { TestCaseInterface } from "src/Models/TestCase";

export interface TestCaseStateInterface {
  openedTCs: TestCaseInterface[];
  selectedTestCaseId: string;
}

const state: TestCaseStateInterface = {
  openedTCs: [],
  selectedTestCaseId: '',
};

export default state;
