import { ActionTree } from 'vuex';
import axios from 'axios';
import { StateInterface } from '../index';
import { KeywordStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<KeywordStateInterface, StateInterface> = {
  async getKeywords(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/keywords/refresh`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authentication: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data;
      context.commit('setKeywords', {
        keywords: responseData,
      });
    } catch (error) {
      throw error;
    }
  },
  setSelectedKeyword(context, payload) {
    context.commit('setSelectedKeyword', payload);
  },
};

export default actions;
