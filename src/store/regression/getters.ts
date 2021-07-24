import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { RegressionStateInterface } from './state';

const getters: GetterTree<RegressionStateInterface, StateInterface> = {
  regressions(state: RegressionStateInterface) {
    return state.regressions;
  },
  selectedRegression(state: RegressionStateInterface) {
    return state.selectedRegression;
  },
};

export default getters;
