import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { api, controller } from '../boot/axios';
import _ from 'lodash';
import uuid from 'uuid-random';
import { TestCaseInterface } from '../Models/TestCase';
import { paintTestCase } from '../components/Utils/TreeUtils';
import { TestStepInterface } from '../Models/TestStep';
import { TestSuiteInterface } from '../Models/TestSuite';
import { CategoryInterface } from '../Models/Category';
import { TestCaseHistoryInterface } from '../Models/TestCaseHistory';
import { useCategoryStore } from './categoryStore';
import { AxiosError } from 'axios';
import { RestoreTestCaseDataInterface } from '../Models/Entities/RestoreTestCaseData';

export const useTestCaseStore = defineStore('testcase', {
  state: () => ({
    openedTCs: [] as TestCaseInterface[],
    copiedTC: undefined as TestCaseInterface | undefined,
    selectedTestCaseId: '',
  }),
  getters: {},
  actions: {
    async getTestCaseById(id: string) {
      const userStore = useUserStore();
      const response = await api.get(`/testcases/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userStore.Token}`,
        },
      });
      let testCase = (await response.data) as TestCaseInterface;
      testCase = paintTestCase(testCase);
      this.setOpenedTCs(testCase);
      this.setSelectedTestCaseId(testCase.Id);
      return testCase;
    },
    async saveTestCase(testCaseHistory: TestCaseHistoryInterface) {
      const userStore = useUserStore();
      try {
        const response = await api.post('/testcases/savetestcase', testCaseHistory, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return responseData;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async editTestCase(testCaseHistory: TestCaseHistoryInterface) {
      const userStore = useUserStore();
      const categoryStore = useCategoryStore();
      try {
        // create in database
        const response = await api.post('/testcases/updatetestcase', testCaseHistory, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseTestCase = (await response.data.data) as TestCaseInterface;
        let testCase = _.cloneDeep(responseTestCase);
        testCase = paintTestCase(testCase);
        categoryStore.updateTestCase(testCase);
        this.updateOpenedTCs(testCase);
        return responseTestCase;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async getUpateHistories(testCaseId: string) {
      const userStore = useUserStore();
      try {
        const response = await api.get(`/testcases/${testCaseId}/getupdatehistories`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseTestCase = (await response.data.data) as TestCaseHistoryInterface[];
        return responseTestCase;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    setOpenedTCs(testCase: TestCaseInterface) {
      const found = this.openedTCs.some((el: TestCaseInterface) => el.Id === testCase.Id);
      if (!found) {
        this.openedTCs.push(testCase);
      }
      this.selectedTestCaseId = testCase.Id;
    },
    updateOpenedTCs(testCase: TestCaseInterface) {
      const index = this.openedTCs.findIndex((tc: TestCaseInterface) => tc.Id === testCase.Id);
      this.openedTCs[index] = testCase;
    },
    setSelectedTestCaseId(testCaseId: string) {
      this.selectedTestCaseId = testCaseId;
    },
    removeOpenedTC(testCase: TestCaseInterface) {
      const index = this.openedTCs.findIndex((el: TestCaseInterface) => el.Id === testCase.Id);
      if (index !== -1) {
        this.openedTCs.splice(index, 1);
        // set selectedTestCase --> next tab
        if (this.openedTCs.length === 0) {
          this.selectedTestCaseId = '';
          return;
        }
        if (index >= this.openedTCs.length) {
          this.selectedTestCaseId = this.openedTCs[this.openedTCs.length - 1].Id;
        } else {
          this.selectedTestCaseId = this.openedTCs[index].Id;
        }
      }
    },
    removeOpenedTCbyTCIds(testCaseIds: string[]) {
      testCaseIds.forEach((tcId: string) => {
        const index = this.openedTCs.findIndex((el: TestCaseInterface) => el.Id === tcId);
        if (index !== -1) {
          this.openedTCs.splice(index, 1);
          // set selectedTestCase --> next tab
          if (this.openedTCs.length === 0) {
            this.selectedTestCaseId = '';
            return;
          }
          if (index >= this.openedTCs.length) {
            this.selectedTestCaseId = this.openedTCs[this.openedTCs.length - 1].Id;
          } else {
            this.selectedTestCaseId = this.openedTCs[index].Id;
          }
        }
      });
    },
    removeOpenedTCbyTestSuite(testSuite: TestSuiteInterface) {
      const testCaseIds = this.openedTCs.filter((tc: TestCaseInterface) => tc.TestSuiteId === testSuite.Id).map((tc: TestCaseInterface) => tc.Id);
      testCaseIds.forEach((tcId: string) => {
        const index = this.openedTCs.findIndex((el: TestCaseInterface) => el.Id === tcId);
        if (index !== -1) {
          this.openedTCs.splice(index, 1);
          // set selectedTestCase --> next tab
          if (this.openedTCs.length === 0) {
            this.selectedTestCaseId = '';
            return;
          }
          if (index >= this.openedTCs.length) {
            this.selectedTestCaseId = this.openedTCs[this.openedTCs.length - 1].Id;
          } else {
            this.selectedTestCaseId = this.openedTCs[index].Id;
          }
        }
      });
    },
    removeOpenedTCbyCategory(category: CategoryInterface) {
      const testCaseIds = this.openedTCs.filter((tc: TestCaseInterface) => tc.CategoryId === category.Id).map((tc: TestCaseInterface) => tc.Id);
      testCaseIds.forEach((tcId: string) => {
        const index = this.openedTCs.findIndex((el: TestCaseInterface) => el.Id === tcId);
        if (index !== -1) {
          this.openedTCs.splice(index, 1);
          // set selectedTestCase --> next tab
          if (this.openedTCs.length === 0) {
            this.selectedTestCaseId = '';
            return;
          }
          if (index >= this.openedTCs.length) {
            this.selectedTestCaseId = this.openedTCs[this.openedTCs.length - 1].Id;
          } else {
            this.selectedTestCaseId = this.openedTCs[index].Id;
          }
        }
      });
    },
    addNewStep(testCaseId: string) {
      // get last item to get Client Name
      const index = this.openedTCs.findIndex((el: TestCaseInterface) => el.Id === testCaseId);
      if (index !== -1) {
        const tempTC = _.cloneDeep(this.openedTCs[index]);
        let lastTestAUTId = '';
        if (tempTC.TestSteps.length > 0) {
          // incase there's no testSteps
          lastTestAUTId = tempTC.TestSteps[tempTC.TestSteps.length - 1].TestAUTId;
        }
        tempTC.TestSteps.push({
          UUID: uuid(),
          TestAUTId: lastTestAUTId,
          Description: '',
          Params: [],
          IsDisabled: false,
          IsComment: false,
          KWFeature: '',
          KWCategory: '',
        });
        this.openedTCs[index] = tempTC;
      }
    },
    deleteStep(payload: any) {
      const { testCaseId } = payload;
      const { stepUUID } = payload;
      const index = this.openedTCs.findIndex((el: any) => el.Id === testCaseId);
      const tempTC = _.cloneDeep(this.openedTCs[index]);
      if (tempTC.TestSteps.length > 0) {
        // incase there's no test steps
        tempTC.TestSteps = tempTC.TestSteps.filter((step: any) => step.UUID !== stepUUID);
      }
      this.openedTCs[index] = tempTC;
    },
    disableStep(payload: any) {
      console.log('payload', payload);
      const { testCaseId } = payload;
      const { stepUUID } = payload;
      const index = this.openedTCs.findIndex((el: any) => el.Id === testCaseId);
      const tempTC = _.cloneDeep(this.openedTCs[index]);
      if (tempTC.TestSteps.length > 0) {
        // incase there's no test steps
        const indexTestStep: number = tempTC.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === stepUUID);
        console.log('indexTestStep', indexTestStep);
        if (indexTestStep !== -1) tempTC.TestSteps[indexTestStep].IsDisabled = true;
      }
      this.openedTCs[index] = tempTC;
    },
    enableStep(payload: any) {
      console.log('payload', payload);
      const { testCaseId } = payload;
      const { stepUUID } = payload;
      const index = this.openedTCs.findIndex((el: any) => el.Id === testCaseId);
      const tempTC = _.cloneDeep(this.openedTCs[index]);
      if (tempTC.TestSteps.length > 0) {
        // incase there's no test steps
        const indexTestStep: number = tempTC.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === stepUUID);
        if (indexTestStep !== -1) tempTC.TestSteps[indexTestStep].IsDisabled = false;
      }
      this.openedTCs[index] = tempTC;
    },
    async GetLastRegressionResult(testCaseId: string) {
      try {
        if (controller) controller.abort();
        const userStore = useUserStore();
        const response = await api.get(`testcases/getlastregressionresult/${testCaseId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        return responseData;
      } catch (error) {
        if (error.isAxiosError) {
          const e: AxiosError = error;
          throw e.response.data;
        } else {
          throw error;
        }
      }
    },
    async restoreTestCase(restoreTestCaseData: RestoreTestCaseDataInterface) {
      try {
        const userStore = useUserStore();
        const response = await api.post('/testcases/restoretestcase', restoreTestCaseData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.Token}`,
          },
        });
        const responseData = await response.data;
        return responseData;
      } catch (error) {
        console.log('e', error);
        if (error.isAxiosError) {
          console.log('b');
          const e: AxiosError = error;
          console.log('e', e.response);
          throw e.response.data;
        } else {
          throw error;
        }
      }
    },
  },
});
