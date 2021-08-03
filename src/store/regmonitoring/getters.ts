import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { RegMonitoringStateInterface } from './state'

const getters: GetterTree<RegMonitoringStateInterface, StateInterface> = {
  regTests(state: RegMonitoringStateInterface) {
    return state.regTests;
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
};

export default getters;
