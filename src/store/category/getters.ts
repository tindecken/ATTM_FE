import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CategoryStateInterface } from './state';

const getters: GetterTree<CategoryStateInterface, StateInterface> = {
  categories(state: CategoryStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.categories;
  },
  selectedCategory(state: CategoryStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.selectedCategory;
  },
};

export default getters;
