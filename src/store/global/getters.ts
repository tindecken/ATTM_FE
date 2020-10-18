import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';

const getters: GetterTree<GlobalStateInterface, StateInterface> = {
  darkTheme(state: GlobalStateInterface) {
    return state.darkTheme;
  },
};

export default getters;
