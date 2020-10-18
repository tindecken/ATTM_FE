import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';

const actions: ActionTree<GlobalStateInterface, StateInterface> = {
  switchDarkTheme(context) {
    context.commit('switchTheme');
  },
};
export default actions;
