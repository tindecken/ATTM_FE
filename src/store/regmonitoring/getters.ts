import { RegressionTestInterface } from 'src/Models/RegressionTest';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { RegMonitoringStateInterface } from './state'

const getters: GetterTree<RegMonitoringStateInterface, StateInterface> = {
  regTests(state: RegMonitoringStateInterface) {
    return state.regTests;
  },
  failedRegTests(state: RegMonitoringStateInterface) {
    return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Failed');
  },
  passedRegTests(state: RegMonitoringStateInterface) {
    return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Passed');
  },
  inQueueRegTests(state: RegMonitoringStateInterface) {
    return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'InQueue');
  },
  runningRegTests(state: RegMonitoringStateInterface) {
    return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Running' || test.Status === 'Inconclusive');
  },
  analyseFailedRegTests(state: RegMonitoringStateInterface) {
    return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'AnalyseFailed');
  },
  analysePassedRegTests(state: RegMonitoringStateInterface) {
    return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'AnalysePassed');
  },
  inCompatibleRegTests(state: RegMonitoringStateInterface) {
    return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'InCompatible');
  },
  selectedRegTest(state: RegMonitoringStateInterface) {
    return state.selectedRegTest;
  },
  categorySelections(state: RegMonitoringStateInterface) {
    return state.categorySelections;
  },
  testSuiteSelections(state: RegMonitoringStateInterface) {
    return state.testSuiteSelections;
  },
  testGroupSelections(state: RegMonitoringStateInterface) {
    return state.testGroupSelections;
  },
  testClientSelections(state: RegMonitoringStateInterface) {
    return state.testClientSelections;
  },
  regressionFilterCriteria(state: RegMonitoringStateInterface) {
    return state.regressionFilterCriteria;
  },
};

export default getters;
