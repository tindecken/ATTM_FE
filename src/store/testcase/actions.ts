import { ActionTree } from 'vuex';
import axios from 'axios';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';
import config from '../../config';
import { paintTestCase } from '../../components/Utils/TreeUtils'

const actions: ActionTree<TestCaseStateInterface, StateInterface> = {
  async getTestCasebyId(context, id) {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log('context', context)
      console.log('id', id)
      const response = await axios.get(
        `${config.baseURL}/testcases/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      let testcase = await response.data;
      console.log('response data', testcase);

      testcase = paintTestCase(testcase);

      context.commit('setopenedTCs', testcase);
      context.commit('setopenedSelectedTC', testcase.Id)
    } catch (error) {
      throw error;
    }
  },
  updateOpenedTCs(context, value) {
    context.commit('updateOpenedTCs', value)
  },
  async saveTestCase(context, tc) {
    try {
      const response = await axios.post(
        `${config.baseURL}/testcases/savetestcase`,
        tc,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data;
      console.log('response data', responseData);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default actions;
