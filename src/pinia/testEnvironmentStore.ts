import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { TestEnvInterface } from '../Models/TestEnv';
import { TestEnvHistoryInterface } from '../Models/TestEnvHistory';
import { useUserStore } from './userStore';

export const useTestEnvironmentStore = defineStore('testEnvironment', {
  state: () => ({
    testEnvs: [] as TestEnvInterface[],
    selectedTestEnv: undefined as TestEnvInterface | undefined,
  }),
  actions: {
    async getTestEnvironments() {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get('/testenvs/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const testEnvs = (await response.data) as TestEnvInterface[];
        this.testEnvs = testEnvs;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async getTestEnv(id: string) {
      const userStore = useUserStore();
      try {
        const response = await api.get(`/testenvs/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const testEnv = (await response.data.data) as TestEnvInterface;
        return testEnv;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async getTestEnvHistories(id: string) {
      const userStore = useUserStore();
      try {
        const response = await api.get(`/testenvs/histories/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const testEnvHistories = (await response.data.data) as TestEnvHistoryInterface[];
        return testEnvHistories;
      } catch (error: any) {
        throw error.response.data;
      }
    },
  },
});
