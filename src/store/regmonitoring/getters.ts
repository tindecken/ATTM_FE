import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { RegMonitoringStateInterface } from './state'

const getters: GetterTree<RegMonitoringStateInterface, StateInterface> = {
  regRunRecords(state: RegMonitoringStateInterface) {
    return state.regRunRecords;
  },
  selectedRegRunRecord(state: RegMonitoringStateInterface) {
    return state.selectedRegRunRecord;
  },
};

export default getters;
