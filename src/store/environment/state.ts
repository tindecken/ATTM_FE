import { TestEnvCategoryInterface } from 'src/Models/TestEnvCategory';

export interface TestEnvironmentStateInterface {
  testEnvCategories: TestEnvCategoryInterface[];
  selectedTestEnvCategory?: TestEnvCategoryInterface
}

const state: TestEnvironmentStateInterface = {
  testEnvCategories: [],
  selectedTestEnvCategory: undefined,
};

export default state;
