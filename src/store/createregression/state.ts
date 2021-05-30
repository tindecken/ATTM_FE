import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';
import { TestClientInterface } from 'src/Models/TestClient';

export interface CreateRegressionStateInterface {
  defineRegression: DefineRegressionInterface | null;
  selectedTestCasesDetail: TestCaseDetailInterface[];
  allTestCasesDetail: TestCaseDetailInterface[];
  selectedTestCases: TestCaseInterface[];
  selectedTestClients: TestClientInterface[];
}

const state: CreateRegressionStateInterface = {
  defineRegression: null,
  selectedTestCasesDetail: [],
  allTestCasesDetail: [],
  selectedTestCases: [],
  selectedTestClients: [],
};

export default state;
