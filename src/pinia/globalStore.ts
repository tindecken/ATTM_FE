import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { InfoStatusDataInterface } from '../Models/Entities/InfoStatusData';
import { TestAUTInterface } from '../Models/TestAUT';
import { useUserStore } from '../pinia/userStore';
import { TestClientInterface } from '../Models/TestClient';
import { AxiosError } from 'axios';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    darkTheme: false as boolean,
    testAUTs: [] as TestAUTInterface[],
    infoStatus: {} as InfoStatusDataInterface,
  }),
  actions: {
    switchDarkTheme() {
      this.darkTheme = !this.darkTheme;
    },
    async buildProject() {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.post('/testproject/buildproject', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        console.log('response', response);
        const responseData = await response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async copydevcodetoclient(testClient: TestClientInterface) {
      const userStore = useUserStore();
      try {
        const response = await api.post(
          '/testproject/copycodetoclient/dev',
          testClient,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        const responseData = await response.data;
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async checkautorunner(testClient: TestClientInterface) {
      const userStore = useUserStore();
      try {
        const response = await api.post(
          '/testproject/checkrunner/Runner',
          testClient,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        const responseData = await response.data;
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async copyregcodetoclient(testClient: TestClientInterface) {
      const userStore = useUserStore();
      try {
        const response = await api.post(
          '/testproject/copycodetoclient/reg',
          testClient,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        const responseData = await response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async updatereleaseforclient(payload: any) {
      const userStore = useUserStore();
      const testClient = payload.testClient as TestClientInterface;
      const newValue = payload.regressionName as string;
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.post(
          `/testproject/updatereleaseforclient/${newValue}`,
          testClient,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        console.log('response', response);
        const responseData = await response.data;
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async getLatestCode() {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.post('/testproject/getlatestcode', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        console.log('response', response);
        const responseData = await response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async generateDevCode(testcases: any) {
      const userStore = useUserStore();
      try {
        const response = await api.post(
          '/testproject/generateDevCode',
          testcases,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        const responseData = await response.data;
        return responseData;
      } catch (error) {
        throw error.response.data;
      }
    },
    async generateRegCode(testcasesDetail: any) {
      const userStore = useUserStore();
      console.log('testcasesDetail', testcasesDetail);
      try {
        const response = await api.post(
          '/testproject/generateRegCode',
          testcasesDetail,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        const responseData = await response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async createDevQueue(payload: any) {
      const userStore = useUserStore();
      console.log('payload', payload);
      try {
        const response = await api.post(
          '/testproject/createdevqueue',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        const responseData = await response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async getTestAUT() {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get('/testauts', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        this.testAUTs = responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
  },
});
