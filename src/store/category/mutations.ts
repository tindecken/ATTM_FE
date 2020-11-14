import { MutationTree } from 'vuex';
import { CategoryStateInterface } from './state';

const mutation: MutationTree<CategoryStateInterface> = {
  setSelectedCategory(state: CategoryStateInterface, payload) {
    state.selectedCategory = payload.selectedCategory;
  },
  setCategories(state: CategoryStateInterface, payload) {
    state.categories = payload.categories;
  },
};

export default mutation;
