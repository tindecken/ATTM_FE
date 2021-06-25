import { store } from 'quasar/wrappers';
import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';
import auth from './auth';
import global from './global';
import keyword from './keyword';
import category from './category';
import testcase from './testcase';
import testsuite from './testsuite';
import testgroup from './testgroup';
import testenvironment from './environment';
import testclient from './testclient';
import createregression from './createregression';
import teststep from './teststep';

import { AuthStateInterface } from './auth/state';
import { GlobalStateInterface } from './global/state';
import { KeywordStateInterface } from './keyword/state';
import { CategoryStateInterface } from './category/state';
import { TestCaseStateInterface } from './testcase/state';
import { TestSuiteStateInterface } from './testsuite/state';
import { TestGroupStateInterface } from './testgroup/state';
import { TestClientStateInterface } from './testclient/state';
import { TestStepStateInterface } from './teststep/state';
import { TestEnvironmentStateInterface } from './environment/state';
import { CreateRegressionStateInterface } from './createregression/state';

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  auth: AuthStateInterface;
  global: GlobalStateInterface;
  keyword: KeywordStateInterface;
  category: CategoryStateInterface;
  testcase: TestCaseStateInterface;
  testsuite: TestSuiteStateInterface;
  testgroup: TestGroupStateInterface;
  testenvironment: TestEnvironmentStateInterface;
  testclient: TestClientStateInterface;
  createregression: CreateRegressionStateInterface;
  teststep: TestStepStateInterface;
}

export default store((/* { ssrContext } */) => {
  const persistGlobal = new VuexPersistence({
    key: 'global',
    modules: ['global'],
  });
  const persistAuth = new VuexPersistence({
    key: 'auth',
    modules: ['auth'],
  });
  const persistCategory = new VuexPersistence({
    key: 'category',
    modules: ['category'],
  });
  const persistTestSuite = new VuexPersistence({
    key: 'testsuite',
    modules: ['testsuite'],
  });
  const persistTestGroup = new VuexPersistence({
    key: 'testgroup',
    modules: ['testgroup'],
  });
  const persistKeyword = new VuexPersistence({
    key: 'keyword',
    modules: ['keyword'],
  });
  const persistTestCase = new VuexPersistence({
    key: 'testcase',
    modules: ['testcase'],
  });
  const persistTestStep = new VuexPersistence({
    key: 'teststep',
    modules: ['teststep'],
  });
  const persistTestEnvironment = new VuexPersistence({
    key: 'testenvironment',
    modules: ['testenvironment'],
  });
  const persistTestClient = new VuexPersistence({
    key: 'testclient',
    modules: ['testclient'],
  });
  const persistCreateRegression = new VuexPersistence({
    key: 'createregression',
    modules: ['createregression'],
  });

  const Store = createStore<StateInterface>({
    modules: {
      auth,
      global,
      keyword,
      category,
      testcase,
      testsuite,
      testgroup,
      testenvironment,
      testclient,
      createregression,
      teststep,
    },
    plugins: [new VuexPersistence().plugin, persistGlobal.plugin, persistAuth.plugin, persistKeyword.plugin, persistTestCase.plugin, persistCategory.plugin, persistTestSuite.plugin, persistTestGroup.plugin, persistTestEnvironment.plugin, persistTestClient.plugin, persistCreateRegression.plugin, persistTestStep.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV,
  });

  return Store;
});
