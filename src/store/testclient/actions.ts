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
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
          },
        },
      );
      const testClients: TestClientInterface[] = await response.data;
      context.commit('setTestClients', testClients);
    } catch (error: any) {
      throw error;
    }
  },
  async ping(context, ip: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/testclients/ping/${ip}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/Token']}`,
          },
        },
      );
      const result = await response.data;
      console.log('ping result', result);
      return result
    } catch (error: any) {
      throw error;
    }
  },
};

export default actions;
