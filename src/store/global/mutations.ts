import { MutationTree } from 'vuex';
import { GlobalStateInterface } from './state';

const mutation: MutationTree<GlobalStateInterface> = {
  switchTheme(state: GlobalStateInterface) {
    state.darkTheme = !state.darkTheme;
  },
  setTestAUTs(state: GlobalStateInterface, payload) {
    state.testAUTs = payload.testAUTs;
  },
};

export default mutation;
