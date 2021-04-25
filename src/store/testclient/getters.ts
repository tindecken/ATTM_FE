import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TestClientStateInterface } from './state';

const getters: GetterTree<TestClientStateInterface, StateInterface> = {
  testClients(state: TestClientStateInterface) {
    return state.testClients;
  },
  selectedTestClient(state: TestClientStateInterface) {
    return state.selectedTestClient;
  },
};

export default getters;
