import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { KeywordStateInterface } from './state';

const getters: GetterTree<KeywordStateInterface, StateInterface> = {
  keywords(state: KeywordStateInterface) {
    return state.keywords;
  },
  selectedKeyword(state: KeywordStateInterface) {
    return state.selectedKeyword;
  },
};

export default getters;
