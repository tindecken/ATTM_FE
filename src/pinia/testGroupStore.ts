import { defineStore } from 'pinia';
import { useUserStore } from '../pinia/userStore';
import { api } from '../boot/axios';
import { TestGroupInterface } from '../Models/TestGroup';
import { TestCaseInterface } from '../Models/TestCase';
import { useCategoryStore } from './categoryStore';
import { useTestCaseStore } from './testCaseStore';

export const useTestGroupStore = defineStore('testgroup', {
  state: () => ({
    testGroups: [] as TestGroupInterface[],
  }),
  getters: {},
  actions: {
    async createTestCase(testCase: TestCaseInterface) {
      const userStore = useUserStore();
      const categoryStore = useCategoryStore();
      try {
        // create in database
        const response = await api.post(
          `/testgroups/${testCase.TestGroupId}/testcases`,
          testCase,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          }
        );
        const responseTestCase = (await response.data) as TestCaseInterface;
        console.log('responseTestCase', responseTestCase);
        // commit to category module
        categoryStore.createTestCase(responseTestCase);
        return responseTestCase;
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async deleteTestCase(testCases: TestCaseInterface[]) {
      const userStore = useUserStore();
      const categoryStore = useCategoryStore();
      const testCaseStore = useTestCaseStore();
      try {
        const arrRequests: any[] = [];
        testCases.forEach((tc: TestCaseInterface) => {
          const request = api.post(
            `testgroups/${tc.TestGroupId}/testcases/delete`,
            [tc.Id],
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userStore.Token}`,
              },
            }
          );
          arrRequests.push(request);
        });
        const responses: any = await Promise.all(arrRequests);
        console.log('responses', responses);
        categoryStore.deleteTestCases(testCases);
        testCases.forEach((tc: TestCaseInterface) => {
          testCaseStore.removeOpenedTC(tc);
        });
        return responses;
      } catch (error: any) {
        console.log('error.response.data', error.response.data.error);
        throw error.response.data.error;
      }
    },
  },
});
