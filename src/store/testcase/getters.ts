import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';

const getters: GetterTree<TestCaseStateInterface, StateInterface> = {
  openedTCs(state: TestCaseStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.openedTCs;
  },
  openedSelectedTC(state: TestCaseStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.openedSelectedTC;
  },
};

export default getters;
