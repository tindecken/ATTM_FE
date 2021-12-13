import _ from 'lodash'
import { MutationTree } from 'vuex';
import { CategoryInterface } from 'src/Models/Category';
import { TestSuiteInterface } from 'src/Models/TestSuite';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { TestCaseInterface } from 'src/Models/TestCase';
import { CategoryStateInterface } from './state';
import {
  paintTestSuite, paintTestGroup, paintTestCase, paintCategory,
} from '../../components/Utils/TreeUtils'

const mutation: MutationTree<CategoryStateInterface> = {
  setSelectedCategory(state: CategoryStateInterface, payload) {
    state.SelectedCategory = payload.selectedCategory;
  },
  setCategories(state: CategoryStateInterface, categories: CategoryInterface[]) {
    state.Categories = categories;
  },
  createTestSuite(state: CategoryStateInterface, responseTestSuite: TestSuiteInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === responseTestSuite.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex]);
    responseTestSuite = paintTestSuite(responseTestSuite)
    responseTestSuite.children = []
    tempCat.TestSuiteIds.push(responseTestSuite.Id)
    tempCat.children.push(responseTestSuite)
    state.Categories[catIndex] = tempCat
  },
  createTestGroup(state: CategoryStateInterface, testGroup: TestGroupInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testGroup.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    // find tsIndex
    const tsIndex = tempCat.TestSuiteIds.findIndex((tsId: string) => tsId === testGroup.TestSuiteId)
    testGroup = paintTestGroup(testGroup)
    tempCat.children[tsIndex].TestGroupIds.push(testGroup.Id)
    tempCat.children[tsIndex].children.push(testGroup)
    state.Categories[catIndex] = tempCat
  },
  createTestCase(state: CategoryStateInterface, testCase: TestCaseInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testCase.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
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
    state.Categories[catIndex] = tempCat
  },
  updateTestCase(state: CategoryStateInterface, testCase: TestCaseInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testCase.CategoryId);
    console.log('catIndex', catIndex)
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    // find tsIndex
    const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === testCase.TestSuiteId)
    console.log('tsIndex', tsIndex)
    // find tgIndex
    const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: TestGroupInterface) => tg.Id === testCase.TestGroupId)
    console.log('tgIndex', tgIndex)
    const tcIndex = tempCat.children[tsIndex].children[tgIndex].children.findIndex((tc: TestCaseInterface) => tc.Id === testCase.Id)
    console.log('tcIndex', tcIndex)
    tempCat.children[tsIndex].children[tgIndex].children[tcIndex] = testCase
    state.Categories[catIndex] = tempCat
  },
  deleteTestCases(state: CategoryStateInterface, testCases: TestCaseInterface[]) {
    testCases.forEach((tc: TestCaseInterface) => {
      const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === tc.CategoryId);
      const tempCat = _.cloneDeep(state.Categories[catIndex])
      // find tsIndex
      const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === tc.TestSuiteId)
      // find tgIndex
      const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: TestGroupInterface) => tg.Id === tc.TestGroupId)
      const tcIndex = tempCat.children[tsIndex].children[tgIndex].children.findIndex((t: TestCaseInterface) => t.Id === tc.Id)
      tempCat.children[tsIndex].children[tgIndex].TestCaseIds?.splice(tcIndex, 1)
      tempCat.children[tsIndex].children[tgIndex].children.splice(tcIndex, 1)
      state.Categories[catIndex] = tempCat
    })
  },
  deleteTestGroup(state: CategoryStateInterface, testGroup: TestGroupInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testGroup.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    // find tsIndex
    const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === testGroup.TestSuiteId)
    // find tgIndex
    const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: TestGroupInterface) => tg.Id === testGroup.Id)
    tempCat.children[tsIndex].TestGroupIds?.splice(tgIndex, 1)
    tempCat.children[tsIndex].children.splice(tgIndex, 1)
    state.Categories[catIndex] = tempCat
  },
  deleteTestSuite(state: CategoryStateInterface, testSuite: TestSuiteInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testSuite.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    // find tsIndex
    const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === testSuite.Id)
    // find tgIndex
    tempCat.TestSuiteIds?.splice(tsIndex, 1)
    tempCat.children.splice(tsIndex, 1)
    state.Categories[catIndex] = tempCat
  },
  deleteCategory(state: CategoryStateInterface, category: CategoryInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === category.Id);
    state.Categories.splice(catIndex, 1)
  },
  createCategory(state: CategoryStateInterface, category: CategoryInterface) {
    category = paintCategory(category)
    state.Categories.push(category)
  },
}

export default mutation;
