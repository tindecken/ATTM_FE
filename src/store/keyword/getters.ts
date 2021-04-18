import { FlatKeywordInterface } from 'src/Models/FlatKeyword';
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
  keywords(state: KeywordStateInterface): FlatKeywordInterface[] {
    return state.keywords
  },
};

export default getters;
