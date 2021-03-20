import { TestCaseInterface } from "src/Models/TestCase";

export interface TestCaseStateInterface {
  openedTCs: TestCaseInterface[];
  openedSelectedTC?: ''
}

const state: TestCaseStateInterface = {
  openedTCs: [],
  openedSelectedTC: undefined,
};

export default state;
