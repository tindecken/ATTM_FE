import { defineStore } from 'pinia'
import { useUserStore } from 'src/pinia/userStore'
import { api } from 'boot/axios'
import { TestSuiteInterface } from 'src/Models/TestSuite'
import { TestGroupInterface } from 'src/Models/TestGroup'
import { useCategoryStore } from './categoryStore'
import { useTestCaseStore } from './testCaseStore'

export const useTestSuiteStore = defineStore('testsuite', {
  state: () => ({
    testSuites: [] as TestSuiteInterface[],
  }),
  getters: {
  },
  actions: {
    async createTestGroup(newTestGroup: TestGroupInterface) {
      const userStore = useUserStore()
      const categoryStore = useCategoryStore()
      try {
        // create in database
        const response = await api.post(
          `/testsuites/${newTestGroup.TestSuiteId}/testgroups`,
          newTestGroup,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        )
        const responseTestGroup = await response.data as TestGroupInterface;
        // create in vuex
        // commit to category module
        categoryStore.createTestGroup(responseTestGroup)
        return responseTestGroup
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async deleteTestGroup(testGroup: TestGroupInterface) {
      const userStore = useUserStore()
      const testCaseStore = useTestCaseStore()
      const categoryStore = useCategoryStore()
      try {
        const response = await api.post(
          `/testsuites/${testGroup.TestSuiteId}/testgroups/delete`,
          [testGroup.Id],
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        categoryStore.deleteTestGroup(testGroup);
        testCaseStore.removeOpenedTCbyTCIds(testGroup.TestCaseIds as string[])
        return response
      } catch (error: any) {
        console.log('error.response.data', error.response.data.error);
        throw error.response.data.error;
      }
    },
  },
})
