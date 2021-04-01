import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
import { MutationTree } from 'vuex';
import { KeywordStateInterface } from './state';

const mutation: MutationTree<KeywordStateInterface> = {
  setSelectedKeyword(state: KeywordStateInterface, payload) {
    state.selectedKeyword = payload.selectedKeyword;
  },
  setKeywordCategories(state: KeywordStateInterface, kwCategories: KeywordCategoryInterface[]) {
    state.keywordCategories = kwCategories;
  },
};

export default mutation;
