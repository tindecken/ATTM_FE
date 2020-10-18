import { Module } from 'vuex';
import state, { GlobalStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import { StateInterface } from '..';

const authModule: Module<GlobalStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default authModule;
