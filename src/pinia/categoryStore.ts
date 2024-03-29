import { defineStore } from 'pinia'
import { useUserStore } from 'src/pinia/userStore'
import { api } from 'boot/axios'
import _ from 'lodash'
import {
  paintCategories, paintCategory, paintTestCase, paintTestGroup, paintTestSuite,
} from 'src/components/Utils/TreeUtils'
import { CategoryInterface } from 'src/Models/Category';
import { TestSuiteInterface } from 'src/Models/TestSuite'
import { TestCaseInterface } from 'src/Models/TestCase'
import { TestGroupInterface } from 'src/Models/TestGroup'
import { useTestCaseStore } from './testCaseStore'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    Categories: [] as CategoryInterface[],
    SelectedCategory: {} as CategoryInterface,
  }),
  getters: {
  },
  actions: {
    async getAllCategories() {
      const userStore = useUserStore()
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await api.get(
          '/categories/getAll',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        let categories: CategoryInterface[] = await response.data.result;
        categories = paintCategories(categories)
        this.Categories = categories
      } catch (error: any) {
        throw error.response.data.error;
      }
    },
    async createTestSuite(newTestSuite: TestSuiteInterface) {
      const userStore = useUserStore()
      try {
        // create in database
        const response = await api.post(
          `/categories/${newTestSuite.CategoryId}/testsuites`,
          newTestSuite,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        )
        const responseTestSuite = await response.data as TestSuiteInterface;
        // update state
        this.createTestSuite_updateState(responseTestSuite)
        return responseTestSuite
      } catch (error: any) {
        throw error.response.data;
      }
    },
    async deleteTestSuite(testSuite: TestSuiteInterface) {
      const userStore = useUserStore()
      const testCaseStore = useTestCaseStore()
      try {
        const response = await api.post(
          `/categories/${testSuite.CategoryId}/testsuites/delete`,
          [testSuite.Id],
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        console.log('response', response)
        this.deleteTestSuite_updateState(testSuite)
        testCaseStore.removeOpenedTCbyTestSuite(testSuite)
        return response
      } catch (error: any) {
        console.log('error.response.data', error.response.data.error);
        throw error.response.data.error;
      }
    },
    async deleteCategory(category: CategoryInterface) {
      const userStore = useUserStore()
      const testCaseStore = useTestCaseStore()
      try {
        const response = await api.post(
          '/categories/delete',
          JSON.stringify(category.Id),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        console.log('response', response)
        this.deleteCategory_updateState(category)
        testCaseStore.removeOpenedTCbyCategory(category)
        return response
      } catch (error: any) {
        console.log('error.response.data', error.response.data.error);
        throw error.response.data.error;
      }
    },
    async createCategory(category: CategoryInterface) {
      const userStore = useUserStore()
      try {
        const response = await api.post(
          '/categories/create',
          JSON.stringify(category),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.Token}`,
            },
          },
        );
        const createdCategory = response.data.data
        this.createCategory_updateState(createdCategory)
        return response.data.data
      } catch (error: any) {
        console.log('error.response.data', error.response.data);
        throw error.response.data;
      }
    },
    createTestSuite_updateState(responseTestSuite: TestSuiteInterface) {
      const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === responseTestSuite.CategoryId);
      const tempCat = _.cloneDeep(this.Categories[catIndex]);
      responseTestSuite = paintTestSuite(responseTestSuite)
      responseTestSuite.children = []
      tempCat.TestSuiteIds.push(responseTestSuite.Id)
      tempCat.children.push(responseTestSuite)
      this.Categories[catIndex] = tempCat
    },
    deleteTestSuite_updateState(testSuite: TestSuiteInterface) {
      const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === testSuite.CategoryId);
      const tempCat = _.cloneDeep(this.Categories[catIndex])
      // find tsIndex
      const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === testSuite.Id)
      // find tgIndex
      tempCat.TestSuiteIds?.splice(tsIndex, 1)
      tempCat.children.splice(tsIndex, 1)
      this.Categories[catIndex] = tempCat
    },
    createTestGroup(testGroup: TestGroupInterface) {
      const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === testGroup.CategoryId);
      const tempCat = _.cloneDeep(this.Categories[catIndex])
      // find tsIndex
      const tsIndex = tempCat.TestSuiteIds.findIndex((tsId: string) => tsId === testGroup.TestSuiteId)
      testGroup = paintTestGroup(testGroup)
      tempCat.children[tsIndex].TestGroupIds.push(testGroup.Id)
      tempCat.children[tsIndex].children.push(testGroup)
      this.Categories[catIndex] = tempCat
    },
    deleteTestGroup(testGroup: TestGroupInterface) {
      const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === testGroup.CategoryId);
      const tempCat = _.cloneDeep(this.Categories[catIndex])
      // find tsIndex
      const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === testGroup.TestSuiteId)
      // find tgIndex
      const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: TestGroupInterface) => tg.Id === testGroup.Id)
      tempCat.children[tsIndex].TestGroupIds?.splice(tgIndex, 1)
      tempCat.children[tsIndex].children.splice(tgIndex, 1)
      this.Categories[catIndex] = tempCat
    },
    updateTestCase(testCase: TestCaseInterface) {
      const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === testCase.CategoryId);
      console.log('catIndex', catIndex)
      const tempCat = _.cloneDeep(this.Categories[catIndex])
      // find tsIndex
      const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === testCase.TestSuiteId)
      console.log('tsIndex', tsIndex)
      // find tgIndex
      const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: TestGroupInterface) => tg.Id === testCase.TestGroupId)
      console.log('tgIndex', tgIndex)
      const tcIndex = tempCat.children[tsIndex].children[tgIndex].children.findIndex((tc: TestCaseInterface) => tc.Id === testCase.Id)
      console.log('tcIndex', tcIndex)
      tempCat.children[tsIndex].children[tgIndex].children[tcIndex] = testCase
      this.Categories[catIndex] = tempCat
    },
    deleteCategory_updateState(category: CategoryInterface) {
      const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === category.Id);
      this.Categories.splice(catIndex, 1)
    },
    createCategory_updateState(category: CategoryInterface) {
      category = paintCategory(category)
      this.Categories.push(category)
    },
    createTestCase(testCase: TestCaseInterface) {
      const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === testCase.CategoryId);
      const tempCat = _.cloneDeep(this.Categories[catIndex])
      // find tsIndex
      const tsIndex = tempCat.TestSuiteIds.findIndex((tsId: string) => tsId === testCase.TestSuiteId)
      // find tgIndex
      const tgIndex = tempCat.children[tsIndex].TestGroupIds.findIndex((tgId: string) => tgId === testCase.TestGroupId)
      testCase = paintTestCase(testCase)
      console.log('testCase', testCase)
      if (!tempCat.children[tsIndex].children[tgIndex].children) { // to make sure TestGroup has children property
        tempCat.children[tsIndex].children[tgIndex].children = []
      }
      tempCat.children[tsIndex].children[tgIndex].children.push(testCase)
      tempCat.children[tsIndex].children[tgIndex].TestCaseIds?.push(testCase.Id)
      this.Categories[catIndex] = tempCat
    },
    deleteTestCases(testCases: TestCaseInterface[]) {
      testCases.forEach((tc: TestCaseInterface) => {
        const catIndex = this.Categories.findIndex((cat: CategoryInterface) => cat.Id === tc.CategoryId);
        const tempCat = _.cloneDeep(this.Categories[catIndex])
        // find tsIndex
        const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === tc.TestSuiteId)
        // find tgIndex
        const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: TestGroupInterface) => tg.Id === tc.TestGroupId)
        const tcIndex = tempCat.children[tsIndex].children[tgIndex].children.findIndex((t: TestCaseInterface) => t.Id === tc.Id)
        tempCat.children[tsIndex].children[tgIndex].TestCaseIds?.splice(tcIndex, 1)
        tempCat.children[tsIndex].children[tgIndex].children.splice(tcIndex, 1)
        this.Categories[catIndex] = tempCat
      })
    },
  },
})
