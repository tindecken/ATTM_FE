import { TestAUTInterface } from 'src/Models/TestAUT'
import { GetterTree } from 'vuex'
import { InfoStatusDataInterface } from 'src/Models/Entities/InfoStatusData'
import { StateInterface } from '../index'
import { GlobalStateInterface } from './state'

const getters: GetterTree<GlobalStateInterface, StateInterface> = {
  darkTheme(state: GlobalStateInterface) : boolean {
    return state.darkTheme;
  },
  testAuTs(state: GlobalStateInterface) : TestAUTInterface[] {
    return state.testAUTs;
  },
  infoStatus(state: GlobalStateInterface) : InfoStatusDataInterface {
    return state.infoStatus;
  },
};

export default getters;
