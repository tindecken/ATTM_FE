import Vue from 'vue';
import _ from 'lodash'
import { MutationTree } from 'vuex';
import { CategoryInterface } from 'src/Models/Category';
import { CategoryStateInterface } from './state';

const mutation: MutationTree<CategoryStateInterface> = {
  setSelectedCategory(state: CategoryStateInterface, payload) {
    state.SelectedCategory = payload.selectedCategory;
  },
  setCategories(state: CategoryStateInterface, categories: CategoryInterface[]) {
    state.Categories = categories;
  },
  createTestSuite(state: CategoryStateInterface, payload) {
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === payload.catId);
    console.log('catIndex', catIndex);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    console.log('tempCat', tempCat)
    tempCat.TestSuites.push(payload.ts.Id)
    const testSuite: any = payload.ts
    // add some need property related to treeNode
    testSuite.label = `${testSuite.tsId}: ${testSuite.name}`
    testSuite.nodeType = 'TestSuite'
    testSuite.children = []
    testSuite.catId = payload.catId
    tempCat.TestSuites.push(testSuite)
    Vue.set(state.Categories, catIndex, tempCat)
  },
  createTestGroup(state: CategoryStateInterface, payload) {
    console.log('payload', payload)
    const catIndex = state.Categories.findIndex((cat: any) => cat.Id === payload.catId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.TestSuites.findIndex((ts: any) => ts.Id === payload.tsId)
    console.log('tsIndex', tsIndex)
    const testGroup = payload.tg
    // add some need property related to treeNode
    testGroup.label = `${testGroup.tgId}: ${testGroup.Name}`
    testGroup.nodeType = 'TestGroup'
    testGroup.children = []
    testGroup.catId = payload.catId
    testGroup.tsId = payload.tsId
    tempCat.TestSuites[tsIndex].TestGroups.push(testGroup)
    Vue.set(state.Categories, catIndex, tempCat)
  },
  createTestCase(state: CategoryStateInterface, payload) {
    console.log('payloaddddddd', payload)
    const catIndex = state.Categories.findIndex((cat: CategoryInterface) => cat.Id === payload.catId);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.TestSuites.findIndex((ts: any) => ts.Id === payload.tsId)
    console.log('tsIndex', tsIndex)
    // find tgIndex
    const tgIndex = tempCat.TestSuites[tsIndex].TestGroups.findIndex((tg: any) => tg.Id === payload.tgMongoId)
    console.log('tgIndex', tgIndex)
    const testCase = payload.tc
    // add some need property related to treeNode
    testCase.label = `${testCase.tcId}: ${testCase.Name}`
    testCase.nodeType = 'TestCase'
    testCase.catId = payload.catId
    testCase.tsId = payload.tsId
    testCase.tgId = payload.tgId
    tempCat.TestSuites[tsIndex].TestGroups[tgIndex].TestCases.push(testCase)
    Vue.set(state.Categories, catIndex, tempCat)
  },
  updateTestCase(state: CategoryStateInterface, testcase) {
    console.log('updateTestCase, testcase:', testcase)
    const catIndex = state.Categories.findIndex((cat: any) => cat.name === testcase.CategoryName);
    const tempCat = _.cloneDeep(state.Categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.TestSuites.findIndex((ts: any) => ts.Id === testcase.TestSuiteId)
    console.log('tsIndex', tsIndex)
    // find tgIndex
    const tgIndex = tempCat.TestSuites[tsIndex].TestGroups.findIndex((tg: any) => tg.Id === testcase.TestGroupId)
    console.log('tgIndex', tgIndex)
    const tcIndex = tempCat.TestSuites[tsIndex].TestGroups[tgIndex].TestCases.findIndex((tc: any) => tc.Id === testcase.Id)
    tempCat.TestSuites[tsIndex].TestGroups[tgIndex].TestCases[tcIndex] = testcase
    Vue.set(state.Categories, catIndex, tempCat)
  },
}

export default mutation;
