import { ActionTree } from 'vuex';
import axios from 'axios';
import { StateInterface } from '../index';
import { CategoryStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<CategoryStateInterface, StateInterface> = {
  async getAllCategories(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/categories/getAll`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data;
      context.commit('setCategories', {
        categories: responseData.result,
      });
    } catch (error) {
      throw error;
    }
  },
  setSelectedCategory(context, payload) {
    context.commit('setSelectedCategory', payload);
  },
};

export default actions;
