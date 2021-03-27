import Vue from 'vue';
import { MutationTree } from 'vuex';
import uuid from 'uuid-random';
import _ from 'lodash'
import { TestCaseStateInterface } from './state';

const mutation: MutationTree<TestCaseStateInterface> = {
  setOpenedTCs(state: TestCaseStateInterface, testcase) {
    const found = state.openedTCs.some((el: any) => el.Id === testcase.Id);
    if (!found) {
      state.openedTCs.push(testcase);
    }
    state.openedSelectedTC = testcase.Id;
  },
  updateOpenedTCs(state: TestCaseStateInterface, testcase) {
    const index = state.openedTCs.findIndex((tc: any) => tc.Id === testcase.Id);
    Vue.set(state.openedTCs, index, testcase)
    console.log('state.openedTCs', state.openedTCs)
  },
  setOpenedSelectedTC(state: TestCaseStateInterface, payload) {
    state.openedSelectedTC = payload;
  },
  removeOpennedTC(state: TestCaseStateInterface, testCaseId) {
    const index = state.openedTCs.findIndex((el: any) => el.Id === testCaseId);
    if (index !== -1) {
      state.openedTCs.splice(index, 1)
      // set selectedTestCase --> next tab
      if (state.openedTCs.length === 0) {
        state.openedSelectedTC.Id = ''
        return
      }
      if (index >= state.openedTCs.length) {
        state.openedSelectedTC = state.openedTCs[state.openedTCs.length - 1].Id
      } else {
        state.openedSelectedTC = state.openedTCs[index].Id
      }
    }
  },
  addNewStep(state: TestCaseStateInterface) {
    // get last item to get Client Name
    const index = state.openedTCs.findIndex((el: any) => el.Id === state.openedSelectedTC);
    if (index !== -1) {
      const tempTC = _.cloneDeep(state.openedTCs[index])
      let lastClient = ''
      if (tempTC.TestSteps.length > 0) { // incase there's no teststeps
        lastClient = tempTC.TestSteps[tempTC.TestSteps.length - 1].TestClient
      }
      console.log('lastClient', lastClient)
      tempTC.TestSteps.push({
        UUID: uuid(),
        TestClient: lastClient,
        Keyword: '',
        Description: '',
        Params: [],
        Name: null,
      })
      Vue.set(state.openedTCs, index, tempTC)
    }
  },
  deleteStep(state: TestCaseStateInterface, payload: any) {
    const { testCaseId } = payload
    const { stepUUID } = payload
    console.log('testCaseId', testCaseId)
    console.log('stepUUID', stepUUID)
    const index = state.openedTCs.findIndex((el: any) => el.Id === testCaseId);
    const tempTC = _.cloneDeep(state.openedTCs[index])
    if (tempTC.TestSteps.length > 0) { // incase there's no test steps
      tempTC.TestSteps = tempTC.TestSteps.filter((step: any) => step.UUID !== stepUUID)
    }
    Vue.set(state.openedTCs, index, tempTC)
  },

};

export default mutation;
