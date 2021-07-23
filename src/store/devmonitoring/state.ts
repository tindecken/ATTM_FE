import { DevRunRecordInterface } from 'src/Models/DevRunRecord'

export interface DevMonitoringStateInterface {
  devRunRecords: DevRunRecordInterface[];
  inQueueDevRunRecords: any[];
  selectedDevRunRecord?: DevRunRecordInterface
}

const state: DevMonitoringStateInterface = {
  devRunRecords: [],
  inQueueDevRunRecords: [],
  selectedDevRunRecord: undefined,
};

export default state;
