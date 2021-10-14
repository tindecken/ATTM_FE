import { ActionTree } from 'vuex';
import axios from 'axios';
import { SettingInterface } from 'src/Models/Setting';
import { StateInterface } from '../index';
import { SettingStateInterface } from './state';
import config from '../../config';

const actions: ActionTree<SettingStateInterface, StateInterface> = {
  async getSettings(context) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/settings/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const settings: SettingInterface[] = await response.data;
      context.commit('setSettings', settings);
    } catch (error: any) {
      throw error;
    }
  },
  async getSettingByName(context: any, name: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.get(
        `${config.baseURL}/settings/${name}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      const setting: SettingInterface = await response.data;
      return setting
    } catch (error: any) {
      throw error;
    }
  },
  async updateSetting(context: any, payload: any) {
    // eslint-disable-next-line no-useless-catch
    try {
      const id = payload.settingId
      const newSetting: SettingInterface = payload.setting
      const response = await axios.post(
        `${config.baseURL}/settings/${id}`,
        newSetting,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.rootGetters['auth/token']}`,
          },
        },
      );
      context.commit('updateSettings', response.data.data);
      return response.data
    } catch (error: any) {
      throw error;
    }
  },
};

export default actions;
