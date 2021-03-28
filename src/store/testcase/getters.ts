import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';

const getters: GetterTree<TestCaseStateInterface, StateInterface> = {
  openedTCs(state: TestCaseStateInterface) {
    return state.openedTCs;
  },
  selectedTestCase(state: TestCaseStateInterface) {
    return state.selectedTestCase;
  },
};

export default getters;
