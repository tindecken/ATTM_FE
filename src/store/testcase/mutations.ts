import Vue from 'vue';
import { MutationTree } from 'vuex';
import uuid from 'uuid-random';
import _ from 'lodash'
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
  addNewStep(state: TestCaseStateInterface) {
    console.log('abc')
    // get last item to get Client Name
    const index = state.opennedTCs.findIndex((el: any) => el.Id === state.opennedSelectedTC);
    console.log('index', index)
    if (index !== -1) {
      const tempTC = _.cloneDeep(state.opennedTCs[index])
      const lastClient = tempTC.TestSteps[tempTC.TestSteps.length - 1].TestClient
      console.log('lastClient', lastClient)
      tempTC.TestSteps.push({
        UUID: uuid(),
        TestClient: lastClient,
        Keyword: '',
        Description: '',
        Params: [],
        Name: null,
      })
      Vue.set(state.opennedTCs, index, tempTC)
    }
  },
};

export default mutation;
