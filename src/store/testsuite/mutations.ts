import Vue from 'vue';
import _ from 'lodash'
import { MutationTree } from 'vuex';
import { TestSuiteStateInterface } from './state';

const mutation: MutationTree<TestSuiteStateInterface> = {
  // eslint-disable-next-line no-unused-vars
  createTestGroup(state: TestSuiteStateInterface, payload: any) {
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
    // tempCat.children.push(testSuite)
    // Vue.set(state.categories, catIndex, tempCat)
  },
}

export default mutation;
