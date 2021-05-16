import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';

export interface CreateRegressionStateInterface {
  defineRegression: DefineRegressionInterface | null;
  selectedTestCasesDetail: TestCaseDetailInterface[];
  allTestCasesDetail: TestCaseDetailInterface[];
  selectedTestCases: TestCaseInterface[];
}

const state: CreateRegressionStateInterface = {
  defineRegression: null,
  selectedTestCasesDetail: [],
  allTestCasesDetail: [],
  selectedTestCases: [],
};

export default state;
