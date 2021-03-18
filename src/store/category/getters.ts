import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CategoryStateInterface } from './state';

const getters: GetterTree<CategoryStateInterface, StateInterface> = {
  categories(state: CategoryStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.Categories;
  },
  selectedCategory(state: CategoryStateInterface) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.SelectedCategory;
  },
};

export default getters;
