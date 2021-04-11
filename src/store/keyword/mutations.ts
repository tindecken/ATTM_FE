import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
import { MutationTree } from 'vuex';
import { KeywordStateInterface } from './state';

const mutation: MutationTree<KeywordStateInterface> = {
  setSelectedKeyword(state: KeywordStateInterface, keyword: KeywordInterface) {
    state.selectedKeyword = keyword;
  },
  setKeywordCategories(state: KeywordStateInterface, kwCategories: KeywordCategoryInterface[]) {
    state.keywordCategories = kwCategories;
  },
};

export default mutation;
