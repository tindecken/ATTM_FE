import { MutationTree } from 'vuex';
import { KeywordStateInterface } from './state';

const mutation: MutationTree<KeywordStateInterface> = {
  setSelectedKeyword(state: KeywordStateInterface, payload) {
    state.selectedKeyword = payload.selectedKeyword;
  },
  setKeywords(state: KeywordStateInterface, payload) {
    state.keywords = payload.keywords;
  },
};

export default mutation;
