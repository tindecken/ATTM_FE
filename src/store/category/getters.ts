import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CategoryStateInterface } from './state';

const getters: GetterTree<CategoryStateInterface, StateInterface> = {
  categories(state: CategoryStateInterface) {
    return state.Categories;
  },
  selectedCategory(state: CategoryStateInterface) {
    return state.SelectedCategory;
  },
};

export default getters;
