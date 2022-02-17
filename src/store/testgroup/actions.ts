import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestCaseInterface } from 'src/Models/TestCase';
import { useUserStore } from 'src/pinia/userStore';
import { StateInterface } from '../index';
import { TestGroupStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<TestGroupStateInterface, StateInterface> = {
  async createTestCase(context, testCase: TestCaseInterface) {
    const userStore = useUserStore()
    try {
      // create in database
      const response = await axios.post(
        `${config.baseURL}/testgroups/${testCase.TestGroupId}/testcases`,
        testCase,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
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
      return responseTestCase
    } catch (error: any) {
      throw error.response.data;
    }
  },
  async deleteTestCase(context, testCases: TestCaseInterface[]) {
    const userStore = useUserStore()
    try {
      const arrRequests: any[] = []
      testCases.forEach((tc: TestCaseInterface) => {
        const request = axios.post(
          `${config.baseURL}/testgroups/${tc.TestGroupId}/testcases/delete`,
          [tc.Id],
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        arrRequests.push(request)
      });
      const responses: any = await Promise.all(arrRequests);
      console.log('responses', responses)
      context.commit('category/deleteTestCases', testCases, { root: true });
      testCases.forEach((tc: TestCaseInterface) => {
        context.commit('testcase/removeOpenedTC', tc, { root: true });
      })
      return responses
    } catch (error: any) {
      console.log('error.response.data', error.response.data.error);
      throw error.response.data.error;
    }
  },
};

export default actions;
