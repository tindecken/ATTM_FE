import { ActionTree } from 'vuex';
import axios from 'axios';
import { RegressionRunRecordInterface } from 'src/Models/RegressionRunRecord'
import { StateInterface } from '../index';
import { RegMonitoringStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<RegMonitoringStateInterface, StateInterface> = {
  async getRegressionDetail(context: any, regressionId: string) {
    try {
      const response = await axios.get(
        `${config.baseURL}/regressions/${regressionId}/getdetail`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data
      const regRunRecords = await responseData.data as RegressionRunRecordInterface [];
      context.commit('setRegRunRecords', regRunRecords);
    } catch (error) {
      throw error.response.data
    }
  },
  async getScreenshot(context: any, screenshotId: string) {
    try {
      const response = await axios.get(
        `${config.baseURL}/gridfsbucket/${screenshotId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const responseData = await response.data
      return responseData.data
    } catch (error) {
      throw error.response.data
    }
  },
};

export default actions;
