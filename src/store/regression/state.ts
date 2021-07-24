import { RegressionInterface } from 'src/Models/Regression';

export interface RegressionStateInterface {
  regressions: RegressionInterface[];
  selectedRegression?: RegressionInterface;
}

const state: RegressionStateInterface = {
  regressions: [],
  selectedRegression: undefined,
};

export default state;
