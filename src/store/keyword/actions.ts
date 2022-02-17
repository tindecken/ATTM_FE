import { ActionTree } from 'vuex';
import axios from 'axios';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
import { useUserStore } from 'src/pinia/userStore';
import { StateInterface } from '../index';
import { KeywordStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<KeywordStateInterface, StateInterface> = {
  async getKeywords(context) {
    const userStore = useUserStore()
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/keywords/getkeywords`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data;
      console.log('responseData', responseData);
      const keywordCategories: KeywordCategoryInterface[] = await responseData.data.Categories;
      context.commit('setKeywordCategories', keywordCategories);
      context.commit('setKeywords', keywordCategories);
      return keywordCategories
    } catch (error: any) {
      throw error;
    }
  },
  setSelectedKeyword(context, payload) {
    context.commit('setSelectedKeyword', payload);
  },
};

export default actions;
