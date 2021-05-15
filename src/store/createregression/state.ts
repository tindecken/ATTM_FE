import { DefineRegressionInterface } from 'src/Models/DefineRegression';

export interface CreateRegressionStateInterface {
  defineRegression: DefineRegressionInterface | null;
}

const state: CreateRegressionStateInterface = {
  defineRegression: null,
};

export default state;
