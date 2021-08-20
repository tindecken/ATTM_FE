import { RegressionFilterCriteriaDataInterface } from 'src/Models/Entities/RegressionFilterCriteriaData';
import { RegressionTestInterface } from 'src/Models/RegressionTest';

export interface RegMonitoringStateInterface {
  regTests: RegressionTestInterface[];
  selectedRegTest?: RegressionTestInterface
  categorySelections: string[]
  testSuiteSelections: string[]
  testGroupSelections: string[]
  testClientSelections: string[]
  regressionFilterCriteria?: RegressionFilterCriteriaDataInterface
}

const state: RegMonitoringStateInterface = {
  categorySelections: [],
  testSuiteSelections: [],
  testGroupSelections: [],
  testClientSelections: [],
  regTests: [],
  selectedRegTest: undefined,
  regressionFilterCriteria: undefined,
};

export default state;
