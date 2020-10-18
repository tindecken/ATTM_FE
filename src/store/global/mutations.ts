import { MutationTree } from 'vuex';
import { GlobalStateInterface } from './state';

const mutation: MutationTree<GlobalStateInterface> = {
  switchTheme(state: GlobalStateInterface) {
    state.darkTheme = !state.darkTheme;
  },
};

export default mutation;
