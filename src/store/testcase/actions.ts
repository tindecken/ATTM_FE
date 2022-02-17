import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseHistoryInterface } from 'src/Models/TestCaseHistory';
import _ from 'lodash';
import { useUserStore } from 'src/pinia/userStore';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';
import config from '../../config';
import { paintTestCase } from '../../components/Utils/TreeUtils'

const actions: ActionTree<TestCaseStateInterface, StateInterface> = {
  async getTestCaseById(context, id: string) {
    const userStore = useUserStore()
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/testcases/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      let testCase = await response.data as TestCaseInterface;

      testCase = paintTestCase(testCase);

      context.commit('setOpenedTCs', testCase);
      context.commit('setSelectedTestCaseId', testCase.Id)
      return testCase
    } catch (error: any) {
      throw error;
    }
  },
  updateOpenedTCs(context, value: TestCaseInterface) {
    context.commit('updateOpenedTCs', value)
  },
  async saveTestCase(context, testCaseHistory: TestCaseHistoryInterface) {
    const userStore = useUserStore()
    try {
      const response = await axios.post(
        `${config.baseURL}/testcases/savetestcase`,
        testCaseHistory,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  async editTestCase(context, testCaseHistory: TestCaseHistoryInterface) {
    const userStore = useUserStore()
    try {
      // create in database
      const response = await axios.post(
        `${config.baseURL}/testcases/updatetestcase`,
        testCaseHistory,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseTestCase = (await response.data.data) as TestCaseInterface;
      let testCase = _.cloneDeep(responseTestCase)
      testCase = paintTestCase(testCase);
      // create in vuex
      // commit to category module
      context.commit('category/updateTestCase', testCase, {
        root: true,
      });
      context.commit('testcase/updateOpenedTCs', testCase, {
        root: true,
      })
      return responseTestCase
    } catch (error: any) {
      throw error.response.data;
    }
  },
  async getUpateHistories(context, testCaseId: string) {
    const userStore = useUserStore()
    try {
      const response = await axios.get(
        `${config.baseURL}/testcases/${testCaseId}/getupdatehistories`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseTestCase = (await response.data.data) as TestCaseHistoryInterface;
      return responseTestCase
    } catch (error: any) {
      throw error.response.data;
    }
  },
};

export default actions;
