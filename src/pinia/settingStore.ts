import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { api } from '../boot/axios';
import { SettingInterface } from '../Models/Setting';
import { AxiosError } from 'axios';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings: [] as SettingInterface[],
  }),
  getters: {
    importBlock: (state): SettingInterface => state.settings.find((setting: SettingInterface) => setting.Name === 'ImportBlock') as SettingInterface,
  },
  actions: {
    async getSettings() {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get('/settings/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const settings: SettingInterface[] = await response.data;
        this.settings = settings;
      } catch (error: any) {
        throw error;
      }
    },
    async getSettingByName(name: string) {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get(`/settings/${name}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const setting: SettingInterface = await response.data;
        return setting;
      } catch (error: any) {
        throw error;
      }
    },
    async updateSetting(payload: any) {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const id = payload.settingId;
        const newSetting: SettingInterface = payload.setting;
        const response = await api.post(`/settings/${id}`, newSetting, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        this.updateSettings_store(response.data.data);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    },
    updateSettings_store(setting: SettingInterface): void {
      const index = this.settings.findIndex((s: SettingInterface) => s.Id === setting.Id);
      if (index >= 0) {
        this.settings[index] = setting;
      }
    },
    async getConfigurations() {
      const userStore = useUserStore();
      try {
        const response = await api.get('/Configures/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const configurations = await response.data;
        return configurations;
      } catch (error) {
        if (error.isAxiosError) {
          const e: AxiosError = error;
          throw e.response.data;
        } else {
          throw error;
        }
      }
    },
  },
});
