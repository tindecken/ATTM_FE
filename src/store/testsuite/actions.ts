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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
          },
        },
      )
      const responseTestGroup = await response.data as TestGroupInterface;
      // create in vuex
      // commit to category module
      context.commit('category/createTestGroup', responseTestGroup, { root: true });
      return responseTestGroup
    } catch (error: any) {
      throw error.response.data;
    }
  },
  async deleteTestGroup(context, testGroup: TestGroupInterface) {
    try {
      const response = await axios.post(
        `${config.baseURL}/testsuites/${testGroup.TestSuiteId}/testgroups/delete`,
        [testGroup.Id],
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
          },
        },
      );
      console.log('response', response)
      context.commit('category/deleteTestGroup', testGroup, { root: true });
      context.commit('testcase/removeOpenedTCbyTCIds', testGroup.TestCaseIds, { root: true });
      return response
    } catch (error: any) {
      console.log('error.response.data', error.response.data.error);
      throw error.response.data.error;
    }
  },
};

export default actions;
