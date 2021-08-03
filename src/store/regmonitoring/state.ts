import { RegressionTestInterface } from 'src/Models/RegressionTest';

export interface RegMonitoringStateInterface {
  regTests: RegressionTestInterface[];
  selectedRegTest?: RegressionTestInterface
  categorySelections: string[]
  testSuiteSelections: string[]
  testGroupSelections: string[]
}

const state: RegMonitoringStateInterface = {
  categorySelections: [],
  testSuiteSelections: [],
  testGroupSelections: [],
  regTests: [],
  selectedRegTest: undefined,
};

export default state;
