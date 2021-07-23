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
  setInQueueDevRunRecords(state: DevMonitoringStateInterface, devQueueRecords: any[]) {
    state.inQueueDevRunRecords = devQueueRecords;
  },
  updateDevRunRecords(state: DevMonitoringStateInterface, devRunRecord: DevRunRecordInterface) {
    // findindex
    const index = state.devRunRecords.findIndex((item: DevRunRecordInterface) => item.Id === devRunRecord.Id)
    if (index === -1) {
      state.devRunRecords.unshift(devRunRecord);
    } else {
      state.devRunRecords[index] = devRunRecord
    }
  },
  updateInDevRunRecords(state: DevMonitoringStateInterface, devQueue: any) {
    console.log('updateInDevRunRecords', devQueue)
    console.log('state.inQueueDevRunRecords', state.inQueueDevRunRecords)
    // findindex
    state.inQueueDevRunRecords = state.inQueueDevRunRecords.filter((item: any) => item.Id !== devQueue.Id)
  },
}
export default mutation;
