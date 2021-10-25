import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestCaseInterface } from 'src/Models/TestCase';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';
import config from '../../config';
import { paintTestCase } from '../../components/Utils/TreeUtils'

const actions: ActionTree<TestCaseStateInterface, StateInterface> = {
  async getTestCaseById(context, id: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/testcases/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
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
  async saveTestCase(context, testCase: TestCaseInterface) {
    try {
      const response = await axios.post(
        `${config.baseURL}/testcases/savetestcase`,
        testCase,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
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
};

export default actions;
