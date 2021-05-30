import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';
import { TestClientInterface } from 'src/Models/TestClient';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CreateRegressionStateInterface } from './state';

const getters: GetterTree<CreateRegressionStateInterface, StateInterface> = {
  defineRegression(state: CreateRegressionStateInterface) {
    return state.defineRegression;
  },
  allTestCasesDetail(state: CreateRegressionStateInterface): TestCaseDetailInterface[] {
    return state.allTestCasesDetail;
  },
  selectedTestCasesDetail(state: CreateRegressionStateInterface): TestCaseDetailInterface[] {
    return state.selectedTestCasesDetail;
  },
  selectedTestCases(state: CreateRegressionStateInterface): TestCaseInterface[] {
    return state.selectedTestCases;
  },
  selectedTestClients(state: CreateRegressionStateInterface): TestClientInterface[] {
    return state.selectedTestClients;
  },
};

export default getters;
