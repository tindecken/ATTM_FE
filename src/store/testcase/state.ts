import { TestCaseInterface } from "src/Models/TestCase";

export interface TestCaseStateInterface {
  openedTCs: TestCaseInterface[];
  openedSelectedTC?: TestCaseInterface
}

const state: TestCaseStateInterface = {
  openedTCs: [],
  openedSelectedTC: undefined,
};

export default state;
