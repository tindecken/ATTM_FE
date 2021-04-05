import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { KeywordStateInterface } from './state';

const getters: GetterTree<KeywordStateInterface, StateInterface> = {
  keywordCategories(state: KeywordStateInterface) : KeywordCategoryInterface[] {
    return state.keywordCategories;
  },
  selectedKeyword(state: KeywordStateInterface) {
    return state.selectedKeyword;
  },
};

export default getters;
