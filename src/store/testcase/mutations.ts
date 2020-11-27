import { MutationTree } from 'vuex';
import { TestCaseStateInterface } from './state';

const mutation: MutationTree<TestCaseStateInterface> = {
  setOpennedTCs(state: TestCaseStateInterface, testcase) {
    const found = state.opennedTCs.some((el: any) => el.Id === testcase.Id);
    if (!found) {
      state.opennedTCs.push(testcase);
    }
    state.opennedSelectedTC = testcase.Id;
  },
  setOpennedSelectedTC(state: TestCaseStateInterface, payload) {
    state.opennedSelectedTC = payload;
  },
};

export default mutation;
