import { RegressionRunRecordInterface } from 'src/Models/RegressionRunRecord'
import { MutationTree } from 'vuex';
import { RegMonitoringStateInterface } from './state'

const mutation: MutationTree<RegMonitoringStateInterface> = {
  setSelectedRegRunRecord(state: RegMonitoringStateInterface, regRunRecord: RegressionRunRecordInterface) {
    state.selectedRegRunRecord = regRunRecord;
  },
  setRegRunRecords(state: RegMonitoringStateInterface, regRunRecords: RegressionRunRecordInterface[]) {
    state.regRunRecords = regRunRecords;
  },
}
export default mutation;
