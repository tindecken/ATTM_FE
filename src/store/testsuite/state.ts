import { TestSuiteInterface } from 'src/Models/TestSuite';

export interface TestSuiteStateInterface {
  testSuites: TestSuiteInterface[];
}

const state: TestSuiteStateInterface = {
  testSuites: [],
};

export default state;
