import { RegressionInterface } from 'src/Models/Regression';
import { MutationTree } from 'vuex';
import { RegressionStateInterface } from './state';

const mutation: MutationTree<RegressionStateInterface> = {
  setRegressions(state: RegressionStateInterface, regressions: RegressionInterface[]) {
    state.regressions = regressions;
  },
  setSelectedRegression(state: RegressionStateInterface, regression: RegressionInterface) {
    state.selectedRegression = regression;
  },
}

export default mutation;
