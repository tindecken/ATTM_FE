import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestCaseInterface } from 'src/Models/TestCase';
import { StateInterface } from '../index';
import { TestGroupStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<TestGroupStateInterface, StateInterface> = {
  async createTestCase(context, testCase: TestCaseInterface) {
    try {
      // create in database
      const response = await axios.post(
        `${config.baseURL}/testgroups/${testCase.TestGroupId}/testcases`,
        testCase,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseTestCase = (await response.data) as TestCaseInterface;
      console.log('responseTestCase', responseTestCase);
      // create in vuex
      // commit to category module
      context.commit('category/createTestCase', responseTestCase, {
        root: true,
      });
    } catch (error) {
      throw error.response.data;
    }
  },
  async deleteTestCase(context, testCase: TestCaseInterface) {
    try {
      // create in database
      const response = await axios.post(
        `${config.baseURL}/testgroups/${testCase.TestGroupId}/testcases/delete`,
        testCase.Id,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseTestCase = (await response.data) as TestCaseInterface;
      console.log('responseTestCase', responseTestCase);
      // create in vuex
      // commit to category module
      // context.commit('category/createTestCase', responseTestCase, { root: true });
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default actions;
