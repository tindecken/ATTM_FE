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
    // const catIndex = state.categories.findIndex((cat: any) => cat.Id === payload.catId);
    // console.log('catIndex', catIndex);
    // const tempCat = _.cloneDeep(state.categories[catIndex])
    // console.log('tempCat', tempCat)
    // tempCat.TestSuites.push(payload.ts.Id)
    // const testSuite = payload.ts
    // // add some need property related to treeNode
    // testSuite.label = `${testSuite.tsId}: ${testSuite.name}`
    // testSuite.nodeType = 'TestSuite'
    // testSuite.children = []
    // testSuite.catId = payload.catId
    // tempCat.children.push(testSuite)
    // Vue.set(state.categories, catIndex, tempCat)
  },
}

export default mutation;
