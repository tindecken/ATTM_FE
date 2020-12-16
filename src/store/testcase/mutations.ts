import Vue from 'vue';
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
  updateOpennedTCs(state: TestCaseStateInterface, testcase) {
    const index = state.opennedTCs.findIndex((tc: any) => tc.Id === testcase.Id);
    Vue.set(state.opennedTCs, index, testcase)
    console.log('state.opennedTCs', state.opennedTCs)
  },
  setOpennedSelectedTC(state: TestCaseStateInterface, payload) {
    state.opennedSelectedTC = payload;
  },
  removeOpennedTC(state: TestCaseStateInterface, testCaseId) {
    const index = state.opennedTCs.findIndex((el: any) => el.Id === testCaseId);
    if (index !== -1) {
      state.opennedTCs.splice(index, 1)
      // set selectedTestCase --> next tab
      if (state.opennedTCs.length === 0) {
        state.opennedSelectedTC = ''
        return
      }
      if (index >= state.opennedTCs.length) {
        state.opennedSelectedTC = state.opennedTCs[state.opennedTCs.length - 1].Id
      } else {
        state.opennedSelectedTC = state.opennedTCs[index].Id
      }
    }
  },
};

export default mutation;
