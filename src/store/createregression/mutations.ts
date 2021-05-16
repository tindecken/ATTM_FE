import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';
import { MutationTree } from 'vuex';
import { CreateRegressionStateInterface } from './state';

const mutation: MutationTree<CreateRegressionStateInterface> = {
  setDefineRegression(state: CreateRegressionStateInterface, defineRegression: DefineRegressionInterface) {
    state.defineRegression = defineRegression;
  },
  setAllTestCasesDetail(state: CreateRegressionStateInterface, testCases: TestCaseDetailInterface[]) {
    state.allTestCasesDetail = testCases
  },
  setSelectedTestCasesDetail(state: CreateRegressionStateInterface, testCases: TestCaseDetailInterface[]) {
    state.selectedTestCasesDetail = testCases
  },
  setSelectedTestCases(state: CreateRegressionStateInterface, testCases: TestCaseInterface[]) {
    state.selectedTestCases = testCases
  },
  addSelectedTestCase(state: CreateRegressionStateInterface, testCase: TestCaseInterface) {
    state.selectedTestCases.push(testCase)
  },
}

export default mutation;
