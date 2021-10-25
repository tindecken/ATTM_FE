import { Module } from 'vuex';
import { UserInterface } from 'src/Models/User';
import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import { StateInterface } from '..';

const authModule: Module<UserInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default authModule;
