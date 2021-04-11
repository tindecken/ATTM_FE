import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestEnvCategoryInterface } from 'src/Models/TestEnvCategory';
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
      const testEnvCategories: TestEnvCategoryInterface[] = await response.data;
      console.log('testEnvCategories', testEnvCategories)
      context.commit('setTestEnvCategories', testEnvCategories);
    } catch (error) {
      throw error;
    }
  },
};

export default actions;
