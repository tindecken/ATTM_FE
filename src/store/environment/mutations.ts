import { TestEnvInterface } from 'src/Models/TestEnv';
import { MutationTree } from 'vuex';
import { TestEnvironmentStateInterface } from './state';

const mutation: MutationTree<TestEnvironmentStateInterface> = {
  setSelectedTestEnv(state: TestEnvironmentStateInterface, testEnv: TestEnvInterface) {
    state.selectedTestEnv = testEnv;
  },
  setTestEnvs(state: TestEnvironmentStateInterface, testEnvs: TestEnvInterface[]) {
    state.testEnvs = testEnvs;
  },
}

export default mutation;
