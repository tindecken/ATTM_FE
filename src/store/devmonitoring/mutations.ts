import { DevRunRecordInterface } from 'src/Models/DevRunRecord'
import { MutationTree } from 'vuex';
import { DevMonitoringStateInterface } from './state'

const mutation: MutationTree<DevMonitoringStateInterface> = {
  setSelectedDevRunRecord(state: DevMonitoringStateInterface, devRunRecord: DevRunRecordInterface) {
    state.selectedDevRunRecord = devRunRecord;
  },
  setDevRunRecords(state: DevMonitoringStateInterface, devRunRecords: DevRunRecordInterface[]) {
    state.devRunRecords = devRunRecords;
  },
  setInQueueDevRunRecords(state: DevMonitoringStateInterface, devRunRecords: DevRunRecordInterface[]) {
    state.inQueueDevRunRecords = devRunRecords;
  },
  updateDevRunRecords(state: DevMonitoringStateInterface, devRunRecord: DevRunRecordInterface) {
    console.log('updateDevRunRecords', devRunRecord)
    // findindex
    const index = state.devRunRecords.findIndex((item: DevRunRecordInterface) => item.Id === devRunRecord.Id)
    if (index === -1) {
      state.devRunRecords.unshift(devRunRecord);
    } else {
      state.devRunRecords[index] = devRunRecord
    }
  },
}
export default mutation;
