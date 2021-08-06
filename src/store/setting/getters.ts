import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { SettingStateInterface } from './state';

const getters: GetterTree<SettingStateInterface, StateInterface> = {
  settings(state: SettingStateInterface) {
    return state.settings;
  },
};

export default getters;
