import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DevMonitoringStateInterface } from './state';

const getters: GetterTree<DevMonitoringStateInterface, StateInterface> = {
  devRunRecords(state: DevMonitoringStateInterface) {
    return state.devRunRecords;
  },
  selectedDevRunRecord(state: DevMonitoringStateInterface) {
    return state.selectedDevRunRecord;
  },
  inQueueDevRunRecords(state: DevMonitoringStateInterface) {
    return state.inQueueDevRunRecords;
  },
};

export default getters;
