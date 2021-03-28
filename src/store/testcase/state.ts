import { TestCaseInterface } from "src/Models/TestCase";

export interface TestCaseStateInterface {
  openedTCs: TestCaseInterface[];
  selectedTestCase?: TestCaseInterface;
}

const state: TestCaseStateInterface = {
  openedTCs: [],
  selectedTestCase: undefined,
};

export default state;
