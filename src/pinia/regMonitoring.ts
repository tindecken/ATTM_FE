import { defineStore } from 'pinia'
import { useUserStore } from 'src/pinia/userStore'
import { api } from 'boot/axios'
import { RegressionFilterCriteriaDataInterface } from 'src/Models/Entities/RegressionFilterCriteriaData'
import { RegressionTestInterface } from 'src/Models/RegressionTest'

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
    selectedRegTest(state) {
      return state.selectedRegTest;
    },
    categorySelections(state) {
      return state.categorySelections;
    },
    testSuiteSelections(state) {
      return state.testSuiteSelections;
    },
    testGroupSelections(state) {
      return state.testGroupSelections;
    },
    testClientSelections(state) {
      return state.testClientSelections;
    },
    regressionFilterCriteria(state) {
      return state.regressionFilterCriteria;
    },
  },
  actions: {
    async getRegressionDetail(regressionId: string) {
      try {
        const userStore = useUserStore()
        const response = await api.get(
          `/regressions/${regressionId}/getdetail`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        const responseData = await response.data
        const regressionTests = await responseData.data as RegressionTestInterface [];
        this.regTests = regressionTests;
        const categories = regressionTests.map((regTest: RegressionTestInterface) => regTest.CategoryName).filter((value, index, self) => self.indexOf(value) === index)
        this.categorySelections = categories;
        const testSuites = regressionTests.map((regTest: RegressionTestInterface) => regTest.TestSuiteFullName).filter((value, index, self) => self.indexOf(value) === index)
        this.testSuiteSelections = testSuites;
        const testGroups = regressionTests.map((regTest: RegressionTestInterface) => regTest.TestGroupFullName).filter((value, index, self) => self.indexOf(value) === index)
        this.testGroupSelections = testGroups;
        const testClients = regressionTests.map((regTest: RegressionTestInterface) => regTest.ClientName).filter((value, index, self) => self.indexOf(value) === index && value !== '')
        this.testClientSelections = testClients;
      } catch (error: any) {
        throw error.response.data
      }
    },
    async getScreenshot(screenshotId: string) {
      const userStore = useUserStore()
      try {
        const response = await api.get(
          `/gridfsbucket/${screenshotId}`,
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
  },
})
