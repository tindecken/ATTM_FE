import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';
import config from '../../config';
import axios from 'axios';

const actions: ActionTree<GlobalStateInterface, StateInterface> = {
  switchDarkTheme(context) {
    context.commit('switchTheme');
  },
  async generateCode(context, testcases) {
    console.log('testcases', testcases);
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/generatecode`,
        testcases,
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
  async getTestAUT(context) {
    try {
      const response = await axios.get(
        `${config.baseURL}/testauts`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data;
      console.log('response data', responseData);
      context.commit('setTestAUTs', {
        testAUTs: responseData,
      });
    } catch (error) {
      throw error;
    }
  },
};
export default actions;