import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { StateInterface } from '../index';
import { TestSuiteStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<TestSuiteStateInterface, StateInterface> = {
  async createTestGroup(context, newTestGroup: TestGroupInterface) {
    try {
      // create in database
      const response = await axios.post(
        `${config.baseURL}/testsuites/${newTestGroup.TestSuiteId}/testgroups`,
        newTestGroup,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      )
      const responseTestGroup = await response.data as TestGroupInterface;
      // create in vuex
      // commit to category module
      context.commit('category/createTestGroup', responseTestGroup, { root: true });
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default actions;
