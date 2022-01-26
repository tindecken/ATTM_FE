import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestEnvInterface } from 'src/Models/TestEnv';
import { StateInterface } from '../index';
import { TestEnvironmentStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<TestEnvironmentStateInterface, StateInterface> = {
  async getTestEnvironments(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/testenvs/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
          },
        },
      );
      const testEnvs = await response.data as TestEnvInterface [];
      context.commit('setTestEnvs', testEnvs);
    } catch (error: any) {
      throw error.response.data
    }
  },
  async getTestEnv(context, id: string) {
    try {
      const response = await axios.get(
        `${config.baseURL}/testenvs/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
          },
        },
      );
      const testEnv = await response.data.data as TestEnvInterface;
      console.log('getTestEnv', testEnv);
      return testEnv
    } catch (error: any) {
      throw error.response.data
    }
  },
};

export default actions;
