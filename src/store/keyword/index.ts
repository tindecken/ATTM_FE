import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { KeywordStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const keywordModule: Module<KeywordStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default keywordModule;
