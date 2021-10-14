import { ActionTree } from 'vuex';
import axios from 'axios';
import { TestClientInterface } from 'src/Models/TestClient';
import { StateInterface } from '../index';
import { TestClientStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<TestClientStateInterface, StateInterface> = {
  async getTestClients(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/testclients/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const testClients: TestClientInterface[] = await response.data;
      context.commit('setTestClients', testClients);
    } catch (error: any) {
      throw error;
    }
  },
};

export default actions;
