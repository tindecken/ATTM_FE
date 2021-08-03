import { RegressionTestInterface } from 'src/Models/RegressionTest';
import { MutationTree } from 'vuex';
import { RegMonitoringStateInterface } from './state'

const mutation: MutationTree<RegMonitoringStateInterface> = {
  setSelectedRegTest(state: RegMonitoringStateInterface, regTest: RegressionTestInterface) {
    state.selectedRegTest = regTest;
  },
  setRegTests(state: RegMonitoringStateInterface, regTests: RegressionTestInterface[]) {
    state.regTests = regTests;
  },
  setCategorySelections(state: RegMonitoringStateInterface, categories: string[]) {
    state.categorySelections = categories;
  },
  setTestSuiteSelections(state: RegMonitoringStateInterface, testsuites: string[]) {
    state.testSuiteSelections = testsuites;
  },
  setTestGroupSelections(state: RegMonitoringStateInterface, testgroups: string[]) {
    state.testGroupSelections = testgroups;
  },
}
export default mutation;
