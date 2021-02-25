import { ActionTree } from 'vuex';
import axios from 'axios';
import { StateInterface } from '../index';
import { TestSuiteStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<TestSuiteStateInterface, StateInterface> = {
  async createTestGroup(context, payload) {
    try {
      // create in database
      const response = await axios.post(
        `${config.baseURL}/testsuites/${payload.testSuiteId}/testgroups`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      )
      const responseData = await response.data;
      // create in vuex
      // commit to category module
      context.commit('category/createTestGroup', {
        catId: payload.catId,
        tsId: payload.testSuiteId,
        tg: responseData,
      }, { root: true });
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default actions;
