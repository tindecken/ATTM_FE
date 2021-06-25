import { TestStepInterface } from "src/Models/TestStep";

export interface TestStepStateInterface {
  copiedTestSteps: TestStepInterface[];
}

const state: TestStepStateInterface = {
  copiedTestSteps: [],
};

export default state;
