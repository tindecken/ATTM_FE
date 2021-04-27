import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestClientInterface } from 'src/Models/TestClient';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<GlobalStateInterface, StateInterface> = {
  switchDarkTheme(context) {
    context.commit('switchTheme');
  },
  async generateCode(context, testcases) {
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error) {
      throw error.response.data;
    }
  },

  async createDevQueue(context, payload) {
    console.log('payload', payload);
    try {
      const response = await axios.post(
        `${config.baseURL}/testproject/createdevqueue`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return responseData;
    } catch (error) {
      throw error.response.data;
    }
  },
  async getTestAUT(context) {
    // eslint-disable-next-line no-useless-catch
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
      context.commit('setTestAUTs', {
        testAUTs: responseData,
      });
    } catch (error) {
      throw error;
    }
  },
};
export default actions
