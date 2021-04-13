import { TestEnvInterface } from 'src/Models/TestEnv';
import { MutationTree } from 'vuex';
import { TestEnvironmentStateInterface } from './state';

const mutation: MutationTree<TestEnvironmentStateInterface> = {
  setSelectedTestEnv(state: TestEnvironmentStateInterface, testEnvCategory: TestEnvInterface) {
    state.selectedTestEnv = testEnvCategory;
  },
  setTestEnvs(state: TestEnvironmentStateInterface, testEnvs: TestEnvInterface[]) {
    state.testEnvs = testEnvs;
  },
}

export default mutation;
