import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { KeywordStateInterface } from './state';

const getters: GetterTree<KeywordStateInterface, StateInterface> = {
  keywords(state: KeywordStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.keywords;
  },
  selectedKeyword(state: KeywordStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.selectedKeyword;
  },
};

export default getters;
