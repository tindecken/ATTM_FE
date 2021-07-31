import { RegressionRunRecordInterface } from 'src/Models/RegressionRunRecord'

export interface RegMonitoringStateInterface {
  regRunRecords: RegressionRunRecordInterface[];
  selectedRegRunRecord?: RegressionRunRecordInterface
}

const state: RegMonitoringStateInterface = {
  regRunRecords: [],
  selectedRegRunRecord: undefined,
};

export default state;
