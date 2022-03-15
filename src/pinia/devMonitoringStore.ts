import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { api } from '../boot/axios';
import { DevRunRecordInterface } from '../Models/DevRunRecord';

export const useDevMonitoringStore = defineStore('devMonitoring', {
  state: () => ({
    devRunRecords: [] as DevRunRecordInterface[],
    inQueueDevRunRecords: [] as any[],
    selectedDevRunRecord: undefined as DevRunRecordInterface | undefined,
  }),
  getters: {},
  actions: {
    async getDevRunRecords() {
      const userStore = useUserStore();
      try {
        const response = await api.get('/devrunrecords/getlast/testcase', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        const devRunRecords =
          (await responseData.data) as DevRunRecordInterface[];
        this.devRunRecords = devRunRecords;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async getInQueueDevRunRecords() {
      const userStore = useUserStore();
      try {
        const response = await api.get('/devqueues/inQueue', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        console.log('response getInQueueDevRunRecords', response);
        const responseData = await response.data;
        const inQueueDevRunRecords =
          (await responseData.data) as DevRunRecordInterface[];
        this.inQueueDevRunRecords = inQueueDevRunRecords;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async getScreenshot(screenshotId: string) {
      const userStore = useUserStore();
      try {
        const response = await api.get(`/gridfsbucket/${screenshotId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        return responseData.data;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    updateDevRunRecords(devRunRecord: DevRunRecordInterface) {
      // findindex
      const index = this.devRunRecords.findIndex(
        (item: DevRunRecordInterface) => item.Id === devRunRecord.Id
      );
      if (index === -1) {
        this.devRunRecords.unshift(devRunRecord);
      } else {
        this.devRunRecords[index] = devRunRecord;
      }
    },
    updateInDevRunRecords(devQueue: any) {
      console.log('updateInDevRunRecords', devQueue);
      console.log('state.inQueueDevRunRecords', this.inQueueDevRunRecords);
      // findindex
      this.inQueueDevRunRecords = this.inQueueDevRunRecords.filter(
        (item: any) => item.Id !== devQueue.Id
      );
    },
  },
});
