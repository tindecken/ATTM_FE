import { ActionTree } from 'vuex';
import axios from 'axios';
import { DevRunRecordInterface } from 'src/Models/DevRunRecord'
import { useUserStore } from 'src/pinia/userStore';
import { StateInterface } from '../index';
import { DevMonitoringStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<DevMonitoringStateInterface, StateInterface> = {
  async getDevRunRecords(context: any) {
    const userStore = useUserStore()
    try {
      const response = await axios.get(
        `${config.baseURL}/devrunrecords/getlast/testcase`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data
      const devRunRecords = await responseData.data as DevRunRecordInterface [];
      context.commit('setDevRunRecords', devRunRecords);
    } catch (error: any) {
      throw error.response.data
    }
  },
  async getInQueueDevRunRecords(context: any) {
    const userStore = useUserStore()
    try {
      const response = await axios.get(
        `${config.baseURL}/devqueues/inQueue`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      console.log('response getInQueueDevRunRecords', response)
      const responseData = await response.data
      const inQueueDevRunRecords = await responseData.data as DevRunRecordInterface [];
      context.commit('setInQueueDevRunRecords', inQueueDevRunRecords);
    } catch (error: any) {
      throw error.response.data
    }
  },
  async getScreenshot(context: any, screenshotId: string) {
    const userStore = useUserStore()
    try {
      const response = await axios.get(
        `${config.baseURL}/gridfsbucket/${screenshotId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        },
      );
      const responseData = await response.data
      return responseData.data
    } catch (error: any) {
      throw error.response.data
    }
  },
};

export default actions;
