import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CreateRegressionStateInterface } from './state';

const getters: GetterTree<CreateRegressionStateInterface, StateInterface> = {
  defineRegression(state: CreateRegressionStateInterface) {
    return state.defineRegression;
  },
};

export default getters;
