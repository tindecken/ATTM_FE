import { defineStore } from 'pinia'
import { useUserStore } from 'src/pinia/userStore'
import { api } from 'boot/axios'
import { RegressionFilterCriteriaDataInterface } from 'src/Models/Entities/RegressionFilterCriteriaData'
import { RegressionTestInterface } from 'src/Models/RegressionTest'
import { RegMonitoringStateInterface } from 'src/store/regmonitoring/state'

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
    regTests(state: RegMonitoringStateInterface) {
      return state.regTests;
    },
    failedRegTests(state: RegMonitoringStateInterface) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Failed');
    },
    passedRegTests(state: RegMonitoringStateInterface) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Passed');
    },
    inQueueRegTests(state: RegMonitoringStateInterface) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'InQueue');
    },
    runningRegTests(state: RegMonitoringStateInterface) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'Running' || test.Status === 'Inconclusive');
    },
    analyseFailedRegTests(state: RegMonitoringStateInterface) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'AnalyseFailed');
    },
    analysePassedRegTests(state: RegMonitoringStateInterface) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'AnalysePassed');
    },
    inCompatibleRegTests(state: RegMonitoringStateInterface) {
      return state.regTests.filter((test: RegressionTestInterface) => test.Status === 'InCompatible');
    },
    selectedRegTest(state: RegMonitoringStateInterface) {
      return state.selectedRegTest;
    },
    categorySelections(state: RegMonitoringStateInterface) {
      return state.categorySelections;
    },
    testSuiteSelections(state: RegMonitoringStateInterface) {
      return state.testSuiteSelections;
    },
    testGroupSelections(state: RegMonitoringStateInterface) {
      return state.testGroupSelections;
    },
    testClientSelections(state: RegMonitoringStateInterface) {
      return state.testClientSelections;
    },
    regressionFilterCriteria(state: RegMonitoringStateInterface) {
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
