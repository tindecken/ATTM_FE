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
        `${config.baseURL}/testenvironments/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const testEnvs: TestEnvInterface[] = await response.data;
      console.log('testEnvs', testEnvs)
      context.commit('setTestEnvs', testEnvs);
    } catch (error) {
      throw error;
    }
  },
};

export default actions;
