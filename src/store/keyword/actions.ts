import { ActionTree } from 'vuex';
import axios from 'axios';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
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
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data.categories;
      console.log('Keyword response.data', responseData);
      const keywordCategories: KeywordCategoryInterface[] = await response.data.categories;
      context.commit('setKeywordCategories', keywordCategories);
    } catch (error) {
      throw error;
    }
  },
  setSelectedKeyword(context, payload) {
    context.commit('setSelectedKeyword', payload);
  },
};

export default actions;
