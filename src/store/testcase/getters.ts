import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';

const getters: GetterTree<TestCaseStateInterface, StateInterface> = {
  openedTCs(state: TestCaseStateInterface) {
    return state.openedTCs;
  },
  selectedTestCaseId(state: TestCaseStateInterface) {
    return state.selectedTestCaseId;
  },
  allTestCasesDetail(state: TestCaseStateInterface): TestCaseDetailInterface[] {
    return state.allTestCasesDetail;
  },
  selectedTestCasesDetail(state: TestCaseStateInterface): TestCaseDetailInterface[] {
    return state.selectedTestCasesDetail;
  },
};

export default getters;
