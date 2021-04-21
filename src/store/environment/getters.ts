import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestEnvironmentStateInterface } from './state';

const getters: GetterTree<TestEnvironmentStateInterface, StateInterface> = {
  testEnvs(state: TestEnvironmentStateInterface) {
    return state.testEnvs;
  },
  selectedTestEnv(state: TestEnvironmentStateInterface) {
    return state.selectedTestEnv;
  },
};

export default getters;
