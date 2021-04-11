import { TestEnvCategoryInterface } from 'src/Models/TestEnvCategory';
import { MutationTree } from 'vuex';
import { TestEnvironmentStateInterface } from './state';

const mutation: MutationTree<TestEnvironmentStateInterface> = {
  setSelectedTestEnvCategory(state: TestEnvironmentStateInterface, testEnvCategory: TestEnvCategoryInterface) {
    state.selectedTestEnvCategory = testEnvCategory;
  },
  setTestEnvCategories(state: TestEnvironmentStateInterface, testEnvCategories: TestEnvCategoryInterface[]) {
    state.testEnvCategories = testEnvCategories;
  },
}

export default mutation;
