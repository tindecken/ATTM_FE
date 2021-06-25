import { TestStepInterface } from 'src/Models/TestStep';
import { MutationTree } from 'vuex';
import uuid from 'uuid-random';
import { TestStepStateInterface } from './state';

const mutation: MutationTree<TestStepStateInterface> = {
  setCopiedTestSteps(state: TestStepStateInterface, testSteps: TestStepInterface[]) {
    state.copiedTestSteps = testSteps.map((step: TestStepInterface) => ({ ...step, UUID: uuid() }))
  },
};

export default mutation;
