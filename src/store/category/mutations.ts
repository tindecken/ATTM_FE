import Vue from 'vue';
import _ from 'lodash'
import { MutationTree } from 'vuex';
import { CategoryInterface } from 'src/Models/Category';
import { TestSuiteInterface } from 'src/Models/TestSuite';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { TestCaseInterface } from 'src/Models/TestCase';
import { CategoryStateInterface } from './state';
import { paintTestSuite, paintTestGroup, paintTestCase } from '../../components/Utils/TreeUtils'

const mutation: MutationTree<CategoryStateInterface> = {
  setSelectedCategory(state: CategoryStateInterface, payload) {
    state.SelectedCategory = payload.selectedCategory;
  },
  setCategories(state: CategoryStateInterface, categories: CategoryInterface[]) {
    state.Categories = categories;
  },
  createTestSuite(state: CategoryStateInterface, responseTestSuite: TestSuiteInterface) {
    console.log('responseTestSuite', responseTestSuite)
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === responseTestSuite.CategoryId);
    console.log('catIndex', catIndex);
    const tempCat = _.cloneDeep(state.Categories[catIndex]);
    console.log('tempCat', tempCat)
    responseTestSuite = paintTestSuite(responseTestSuite)
    tempCat.TestSuiteIds.push(responseTestSuite.Id)
    tempCat.children.push(responseTestSuite)
    Vue.set(state.Categories, catIndex, tempCat)
  },
  createTestGroup(state: CategoryStateInterface, testGroup: TestGroupInterface) {
    console.log('testGroup', testGroup)
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testGroup.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.TestSuiteIds.findIndex((tsId: string) => tsId === testGroup.TestSuiteId)
    console.log('tsIndex', tsIndex)
    testGroup = paintTestGroup(testGroup)
    tempCat.children[tsIndex].TestGroupIds.push(testGroup.Id)
    tempCat.children[tsIndex].children.push(testGroup)
    Vue.set(state.Categories, catIndex, tempCat)
  },
  createTestCase(state: CategoryStateInterface, testCase: TestCaseInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testCase.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.TestSuiteIds.findIndex((tsId: string) => tsId === testCase.TestSuiteId)
    console.log('tsIndex', tsIndex)
    // find tgIndex
    const tgIndex = tempCat.children[tsIndex].TestGroupIds.findIndex((tgId: string) => tgId === testCase.TestGroupId)
    console.log('tgIndex', tgIndex)
    testCase = paintTestCase(testCase)
    tempCat.children[tsIndex].children[tgIndex].children.push(testCase)
    Vue.set(state.Categories, catIndex, tempCat)
  },
  updateTestCase(state: CategoryStateInterface, testCase: TestCaseInterface) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === testCase.CategoryId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.children.findIndex((ts: TestSuiteInterface) => ts.Id === testCase.TestSuiteId)
    console.log('tsIndex', tsIndex)
    // find tgIndex
    const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: TestGroupInterface) => tg.Id === testCase.TestGroupId)
    console.log('tgIndex', tgIndex)
    const tcIndex = tempCat.children[tsIndex].children[tgIndex].children.findIndex((tc: TestCaseInterface) => tc.Id === testCase.Id)
    tempCat.children[tsIndex].children[tgIndex].children[tcIndex] = testCase
    Vue.set(state.Categories, catIndex, tempCat)
  },
}

export default mutation;
