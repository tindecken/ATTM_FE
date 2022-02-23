import { defineStore } from 'pinia'
import { useUserStore } from 'src/pinia/userStore'
import { api } from 'boot/axios'
import { SettingInterface } from 'src/Models/Setting'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    settings: [] as SettingInterface[],
  }),
  getters: {
  },
  actions: {
    async getSettings() {
      const userStore = useUserStore()
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get(
          '/settings/',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        const settings: SettingInterface[] = await response.data;
        this.settings = settings
      } catch (error: any) {
        throw error;
      }
    },
    async getSettingByName(name: string) {
      const userStore = useUserStore()
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get(
          `/settings/${name}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        const setting: SettingInterface = await response.data;
        return setting
      } catch (error: any) {
        throw error;
      }
    },
    async updateSetting(payload: any) {
      const userStore = useUserStore()
      // eslint-disable-next-line no-useless-catch
      try {
        const id = payload.settingId
        const newSetting: SettingInterface = payload.setting
        const response = await api.post(
          `/settings/${id}`,
          newSetting,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        this.updateSettings_store(response.data.data)
        return response.data
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
  },
})
