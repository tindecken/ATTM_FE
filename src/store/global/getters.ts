import { TestAUTInterface } from 'src/Models/TestAUT';
import { TestEnvInterface } from 'src/Models/TestEnv';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GlobalStateInterface } from './state';

const getters: GetterTree<GlobalStateInterface, StateInterface> = {
  darkTheme(state: GlobalStateInterface) : boolean {
    return state.darkTheme;
  },
  testAuTs(state: GlobalStateInterface) : TestAUTInterface[] {
    return state.testAUTs;
  },
  selectedTestEnv(state: GlobalStateInterface) : TestEnvInterface | undefined {
    return state.selectedTestEnv
  },
};

export default getters;
