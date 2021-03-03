import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestGroupStateInterface } from './state';

const getters: GetterTree<TestGroupStateInterface, StateInterface> = {
  testSuites(state: TestGroupStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.testGroups;
  },
};

export default getters;
