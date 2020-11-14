import { ActionTree } from 'vuex';
import axios from 'axios';
import { StateInterface } from '../index';
import { CategoryStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<CategoryStateInterface, StateInterface> = {
  async getCategories(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/categories`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data;
      context.commit('setCategories', {
        categories: responseData,
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
