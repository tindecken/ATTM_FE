import { ActionTree } from 'vuex';
import axios from 'axios';
import { StateInterface } from '../index';
import { TestCaseStateInterface } from './state';
import config from '../../config';

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
      const testcase = await response.data;
      console.log('response data', testcase);
      context.commit('setOpennedTCs', testcase);
      context.commit('setOpennedSelectedTC', testcase.Id)
    } catch (error) {
      throw error;
    }
  },
  updateOpennedTCs(context, value) {
    context.commit('updateOpennedTCs', value)
  },
  addNewStep(context, value) {
    context.commit('addNewStep', value)
  },
};

export default actions;
