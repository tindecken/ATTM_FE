import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { api } from '../boot/axios';
import { TestCaseInterface } from '../Models/TestCase';
import { DefineRegressionInterface } from '../Models/DefineRegression';
import { TestCaseDetailInterface } from '../Models/TestCaseDetail';
import { TestClientInterface } from '../Models/TestClient';

export const useCreateRegressionStore = defineStore('createRegression', {
  state: () => ({
    defineRegression: null as DefineRegressionInterface | null,
    selectedTestCasesDetail: [] as TestCaseDetailInterface[],
    allTestCasesDetail: [] as TestCaseDetailInterface[],
    selectedTestCases: [] as TestCaseInterface[],
    selectedTestClients: [] as TestClientInterface[],
  }),
  getters: {},
  actions: {
    async createRegression(regression: DefineRegressionInterface) {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        return await api.post('/regressions', regression, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
      } catch (error: any) {
        throw error;
      }
    },
    async getAllTestCaseDetails() {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get('/testcases/getAllDetail', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const testcases = await response.data;
        this.allTestCasesDetail = testcases.data;
      } catch (error: any) {
        throw error;
      }
    },
    async getAndAddSelectedTestCase(selectedTestCasesDetail: TestCaseDetailInterface[]) {
      const userStore = useUserStore();
      const promises: any = [];
      selectedTestCasesDetail.forEach((tc: TestCaseDetailInterface) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        promises.push(
          api.get(`/testcases/${tc.Id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          })
        );
      });
      // eslint-disable-next-line no-useless-catch
      try {
        await Promise.all(promises)
          .then((results) => {
            results.forEach((response: any) => {
              this.addSelectedTestCase(response.data);
            });
          })
          .catch((error: any) => {
            throw error;
          });
      } catch (error: any) {
        throw error;
      }
    },
    async createRegressionTests(payload: any) {
      const userStore = useUserStore();
      // eslint-disable-next-line no-useless-catch
      try {
        const { regressionId } = payload;
        const { selectedTestCasesDetailIds } = payload;
        return await api.post(`/regressions/${regressionId}/createregressiontests`, selectedTestCasesDetailIds, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
      } catch (error: any) {
        throw error;
      }
    },
    addSelectedTestCase(testCase: TestCaseInterface) {
      this.selectedTestCases.push(testCase);
    },
  },
});
