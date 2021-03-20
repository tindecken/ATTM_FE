import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';

const getters: GetterTree<TestCaseStateInterface, StateInterface> = {
  openedTCs(state: TestCaseStateInterface) {
    return state.openedTCs;
  },
  openedSelectedTC(state: TestCaseStateInterface) {
    return state.openedSelectedTC;
  },
};

export default getters;
