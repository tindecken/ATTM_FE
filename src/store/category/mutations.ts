import Vue from 'vue';
import _ from 'lodash'
import { MutationTree } from 'vuex';
import { CategoryStateInterface } from './state';

const mutation: MutationTree<CategoryStateInterface> = {
  setSelectedCategory(state: CategoryStateInterface, payload) {
    state.selectedCategory = payload.selectedCategory;
  },
  setCategories(state: CategoryStateInterface, payload) {
    state.categories = payload.categories;
  },
  createTestSuite(state: CategoryStateInterface, payload) {
    const catIndex = state.categories.findIndex((cat: any) => cat.Id === payload.catId);
    console.log('catIndex', catIndex);
    const tempCat = _.cloneDeep(state.categories[catIndex])
    console.log('tempCat', tempCat)
    tempCat.TestSuites.push(payload.ts.Id)
    const testSuite = payload.ts
    // add some need property related to treeNode
    testSuite.label = `${testSuite.tsId}: ${testSuite.name}`
    testSuite.nodeType = 'TestSuite'
    testSuite.children = []
    testSuite.catId = payload.catId
    tempCat.children.push(testSuite)
    Vue.set(state.categories, catIndex, tempCat)
  },
  createTestGroup(state: CategoryStateInterface, payload) {
    console.log('payload', payload)
    const catIndex = state.categories.findIndex((cat: any) => cat.Id === payload.catId);
    const tempCat = _.cloneDeep(state.categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.children.findIndex((ts: any) => ts.Id === payload.tsId)
    console.log('tsIndex', tsIndex)
    const testGroup = payload.tg
    // add some need property related to treeNode
    testGroup.label = `${testGroup.tgId}: ${testGroup.Name}`
    testGroup.nodeType = 'TestGroup'
    testGroup.children = []
    testGroup.catId = payload.catId
    testGroup.tsId = payload.tsId
    tempCat.children[tsIndex].children.push(testGroup)
    Vue.set(state.categories, catIndex, tempCat)
  },
  createTestCase(state: CategoryStateInterface, payload) {
    console.log('payload', payload)
    const catIndex = state.categories.findIndex((cat: any) => cat.Id === payload.catId);
    const tempCat = _.cloneDeep(state.categories[catIndex])
    console.log('tempCat', tempCat)
    // find tsIndex
    const tsIndex = tempCat.children.findIndex((ts: any) => ts.Id === payload.tsId)
    console.log('tsIndex', tsIndex)
    // find tgIndex
    const tgIndex = tempCat.children[tsIndex].children.findIndex((tg: any) => tg.Id === payload.tgId)
    console.log('tgIndex', tgIndex)
    const testCase = payload.tc
    // add some need property related to treeNode
    testCase.label = `${testCase.tcId}: ${testCase.Name}`
    testCase.nodeType = 'TestCase'
    testCase.catId = payload.catId
    testCase.tsId = payload.tsId
    testCase.tgId = payload.tgId
    tempCat.children[tsIndex].children[tgIndex].children.push(testCase)
    Vue.set(state.categories, catIndex, tempCat)
  },
}

export default mutation;
