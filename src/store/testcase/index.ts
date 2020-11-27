import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { TestCaseStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const testCaseModule: Module<TestCaseStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default testCaseModule;
