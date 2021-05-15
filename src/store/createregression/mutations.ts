import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { MutationTree } from 'vuex';
import { CreateRegressionStateInterface } from './state';

const mutation: MutationTree<CreateRegressionStateInterface> = {
  setDefineRegression(state: CreateRegressionStateInterface, defineRegression: DefineRegressionInterface) {
    state.defineRegression = defineRegression;
  },
}

export default mutation;
