import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';

const getters: GetterTree<TestCaseStateInterface, StateInterface> = {
  opennedTCs(state: TestCaseStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.opennedTCs;
  },
  opennedSelectedTC(state: TestCaseStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.opennedSelectedTC;
  },
};

export default getters;
