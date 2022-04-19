import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { api } from '../boot/axios';
import { RegressionFilterCriteriaDataInterface } from '../Models/Entities/RegressionFilterCriteriaData';
import { RegressionTestInterface } from '../Models/RegressionTest';
import { AxiosError } from 'axios';
import { FindRegressionTestDataInterface } from '../Models/Entities/FindRegressionTestData';

export const useRegMonitoringStore = defineStore('regMonitoring', {
  state: () => ({
    regTests: [] as RegressionTestInterface[],
    selectedRegTest: {} as RegressionTestInterface,
    categorySelections: [] as string[],
    testSuiteSelections: [] as string[],
    testGroupSelections: [] as string[],
    testClientSelections: [] as string[],
    regressionFilterCriteria: {} as RegressionFilterCriteriaDataInterface,
  }),
  getters: {
    failedRegTests(state) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Failed');
    },
    passedRegTests(state) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Passed');
    },
    inQueueRegTests(state) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'InQueue');
    },
    runningRegTests(state) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Running' || test.Status === 'Inconclusive');
    },
    analyseFailedRegTests(state) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'AnalyseFailed');
    },
    analysePassedRegTests(state) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'AnalysePassed');
    },
    inCompatibleRegTests(state) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'InCompatible');
    },
  },
  actions: {
    async getRegressionDetail(regressionId: string) {
      try {
        const userStore = useUserStore();
        const response = await api.get(`/regressions/${regressionId}/getdetail`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        const regressionTests = (await responseData.data) as RegressionTestInterface[];
        console.log('regressionTests', regressionTests);
        this.regTests = regressionTests;
        const categories = regressionTests
          .map((regTest: RegressionTestInterface) => regTest.CategoryName)
          .filter((value, index, self) => self.indexOf(value) === index);
        console.log('categories', categories);
        this.categorySelections = categories;
        const testSuites = regressionTests
          .map((regTest: RegressionTestInterface) => regTest.TestSuiteFullName)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.testSuiteSelections = testSuites;
        const testGroups = regressionTests
          .map((regTest: RegressionTestInterface) => regTest.TestGroupFullName)
          .filter((value, index, self) => self.indexOf(value) === index);
        this.testGroupSelections = testGroups;
        const testClients = regressionTests
          .map((regTest: RegressionTestInterface) => regTest.ClientName)
          .filter((value, index, self) => self.indexOf(value) === index && value !== '');
        this.testClientSelections = testClients;
      } catch (error: any) {
        if (error.isAxiosError) {
          const e: AxiosError = error;
          throw e.response.data;
        } else {
          console.log('a', error);
          throw error;
        }
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
    async findRegressionTest(payload: FindRegressionTestDataInterface) {
      const userStore = useUserStore();
      try {
        const response = await api.post('/regressions/findregressiontest', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        const regressionTests = (await responseData.data) as RegressionTestInterface[];
        console.log('regressionTests', regressionTests);
        this.regTests = regressionTests;
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
