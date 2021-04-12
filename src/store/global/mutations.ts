import { TestEnvInterface } from 'src/Models/TestEnv';
import { MutationTree } from 'vuex';
import { GlobalStateInterface } from './state';

const mutation: MutationTree<GlobalStateInterface> = {
  switchTheme(state: GlobalStateInterface) {
    state.darkTheme = !state.darkTheme;
  },
  setTestAUTs(state: GlobalStateInterface, payload) {
    state.testAUTs = payload.testAUTs;
  },
  setSelectedTestEnv(state: GlobalStateInterface, testEnv: TestEnvInterface) {
    state.selectedTestEnv = testEnv;
  },
};

export default mutation;
