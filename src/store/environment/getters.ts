import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestEnvironmentStateInterface } from './state';

const getters: GetterTree<TestEnvironmentStateInterface, StateInterface> = {
  testEnvCategories(state: TestEnvironmentStateInterface) {
    return state.testEnvCategories;
  },
  selectedTestEnvCategory(state: TestEnvironmentStateInterface) {
    return state.selectedTestEnvCategory;
  },
};

export default getters;
