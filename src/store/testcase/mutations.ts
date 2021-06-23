import { MutationTree } from 'vuex';
import uuid from 'uuid-random';
import _ from 'lodash';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestStepInterface } from 'src/Models/TestStep';
import { TestCaseStateInterface } from './state';

const mutation: MutationTree<TestCaseStateInterface> = {
  setOpenedTCs(state: TestCaseStateInterface, testCase: TestCaseInterface) {
    const found = state.openedTCs.some((el: TestCaseInterface) => el.Id === testCase.Id);
    if (!found) {
      state.openedTCs.push(testCase);
    }
    state.selectedTestCaseId = testCase.Id;
  },
  updateOpenedTCs(state: TestCaseStateInterface, testCase: TestCaseInterface) {
    const index = state.openedTCs.findIndex((tc: TestCaseInterface) => tc.Id === testCase.Id);
    state.openedTCs[index] = testCase
  },
  setSelectedTestCaseId(state: TestCaseStateInterface, testCaseId: string) {
    state.selectedTestCaseId = testCaseId;
  },
  removeOpenedTC(state: TestCaseStateInterface, testCase: TestCaseInterface) {
    const index = state.openedTCs.findIndex((el: TestCaseInterface) => el.Id === testCase.Id);
    if (index !== -1) {
      state.openedTCs.splice(index, 1)
      // set selectedTestCase --> next tab
      if (state.openedTCs.length === 0) {
        state.selectedTestCaseId = '';
        return
      }
      if (index >= state.openedTCs.length) {
        state.selectedTestCaseId = state.openedTCs[state.openedTCs.length - 1].Id
      } else {
        state.selectedTestCaseId = state.openedTCs[index].Id
      }
    }
  },
  addNewStep(state: TestCaseStateInterface, testCaseId: string) {
    // get last item to get Client Name
    const index = state.openedTCs.findIndex((el: TestCaseInterface) => el.Id === testCaseId);
    if (index !== -1) {
      const tempTC = _.cloneDeep(state.openedTCs[index])
      let lastTestAUTId = '';
      if (tempTC.TestSteps.length > 0) { // incase there's no testSteps
        lastTestAUTId = tempTC.TestSteps[tempTC.TestSteps.length - 1].TestAUTId
      }
      tempTC.TestSteps.push({
        UUID: uuid(),
        TestAUTId: lastTestAUTId,
        Description: '',
        Params: [],
        IsDisabled: false,
        IsComment: false,
        KWFeature: '',
        KWCategory: '',
      })
      state.openedTCs[index] = tempTC
    }
  },
  deleteStep(state: TestCaseStateInterface, payload: any) {
    const { testCaseId } = payload
    const { stepUUID } = payload
    const index = state.openedTCs.findIndex((el: any) => el.Id === testCaseId);
    const tempTC = _.cloneDeep(state.openedTCs[index])
    if (tempTC.TestSteps.length > 0) { // incase there's no test steps
      tempTC.TestSteps = tempTC.TestSteps.filter((step: any) => step.UUID !== stepUUID)
    }
    state.openedTCs[index] = tempTC
  },

  disableStep(state: TestCaseStateInterface, payload: any) {
    console.log('state', state)
    console.log('payload', payload)
    const { testCaseId } = payload
    const { stepUUID } = payload
    const index = state.openedTCs.findIndex((el: any) => el.Id === testCaseId);
    const tempTC = _.cloneDeep(state.openedTCs[index])
    if (tempTC.TestSteps.length > 0) { // incase there's no test steps
      const indexTestStep: number = tempTC.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === stepUUID);
      console.log('indexTestStep', indexTestStep)
      if (indexTestStep !== -1) tempTC.TestSteps[indexTestStep].IsDisabled = true;
    }
    state.openedTCs[index] = tempTC
  },
  enableStep(state: TestCaseStateInterface, payload: any) {
    console.log('state', state)
    console.log('payload', payload)
    const { testCaseId } = payload
    const { stepUUID } = payload
    const index = state.openedTCs.findIndex((el: any) => el.Id === testCaseId);
    const tempTC = _.cloneDeep(state.openedTCs[index])
    if (tempTC.TestSteps.length > 0) { // incase there's no test steps
      const indexTestStep: number = tempTC.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === stepUUID);
      if (indexTestStep !== -1) tempTC.TestSteps[indexTestStep].IsDisabled = false;
    }
    state.openedTCs[index] = tempTC
  },

};

export default mutation;
