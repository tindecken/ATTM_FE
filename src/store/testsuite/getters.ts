import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestSuiteStateInterface } from './state';

const Getters: GetterTree<TestSuiteStateInterface, StateInterface> = {
  testSuites(state: TestSuiteStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.testSuites;
  },
};

export default Getters;
